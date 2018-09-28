import {ChangeDetectorRef, Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {DossierBaseService} from './dossier-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'dossier-base',
  templateUrl: './dossier-base.component.html',
  styleUrls: ['./dossier-base.component.css']
})

export class DossierBaseComponent implements OnInit {
  public errors;
  @Input() isInternal;
  @Input() lang;

  private _appInfoErrors = [];
  private _dossierErrors = [];
  public isFinal = false;
  public dossierForm: FormGroup;
  public errorList = [];
  public rootTagText = 'DOSSIER_ENROL';
  public isInternalSite = false;
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';
  public dossierModel = DossierBaseService.getEmptyDossierDetailsModel();
  public appInfoModel = DossierBaseService.getEmptyAppInfoModel();
  public fileServices: FileConversionService;
  public saveXmlLabel = 'save.draft';
  public xslName = 'REP_MDS_DO_1_0.xsl';

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showErrors = false;
    this.fileServices = new FileConversionService();
  }

  ngOnInit() {
    if (!this.dossierForm) {
      this.dossierForm = DossierBaseService.getReactiveModel(this._fb);
    }
    if (this.isInternal === GlobalsService.YES) {
      this.isInternalSite = true;
      this.saveXmlLabel = 'approve.final';
    }
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in Company base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._appInfoErrors.concat(this._dossierErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processAddressErrors(errorList) {
    this._dossierErrors = errorList;
    this.processErrors();
  }

  processAppInfoErrors(errorList) {
    this._appInfoErrors = errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  public saveXmlFile() {
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
    } else {
      this._updatedAutoFields();
      const result = {
        'DOSSIER_ENROL': {
          'application_information': this.appInfoModel,
          'dossier': this.dossierModel
        }
      };
      this.fileServices.saveXmlToFile(result, 'hcmdsdo', true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    const result = {'DOSSIER_ENROL': {
      'application_information': this.appInfoModel,
      'dossier': this.dossierModel
    }};
    this.fileServices.saveJsonToFile(result, 'hcmdsdo-test', null);
  }

  public processFile(fileData: ConvertResults) {
     console.log('processing file.....');
     console.log(fileData);
    this.appInfoModel = fileData.data.COMPANY_ENROL.application_information;
    this.isFinal = (this.appInfoModel.status === GlobalsService.FINAL);
    this.dossierModel = fileData.data.COMPANY_ENROL.dossier;
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    if (this.isInternalSite) {
      this.appInfoModel.status = DossierBaseService.setFinalStatus();
      this.appInfoModel.enrolVersion = Math.floor(this.appInfoModel.enrolVersion) + 1;
    } else {
      this.appInfoModel.enrolVersion += 0.1;
    }
  }

  private _updatedSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.appInfoModel.lastSavedDate = pipe.transform(today, 'yyyy-MM-dd');
  }
}
