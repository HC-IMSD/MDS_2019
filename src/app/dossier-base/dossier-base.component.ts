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

  private _genInfoErrors = [];
  private _dossierErrors = [];
  public disableSaveXml = true;
  public isFinal = false;
  public dossierForm: FormGroup;
  public errorList = [];
  public rootTagText = 'MDS_DOSSIER_ENROL';
  public isInternalSite = false;
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';
  public dossierModel = DossierBaseService.getEmptyDossierDetailsModel();
  public genInfoModel = DossierBaseService.getEmptyGenInfoModel();
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

  public updateChild() {
    // console.log("Calling updateChild")
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in Company base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._genInfoErrors.concat(this._dossierErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processAddressErrors(errorList) {
    this._dossierErrors = errorList;
    this.processErrors();
  }

  processGenInfoErrors(errorList) {
    this._genInfoErrors = errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  disableSaveXmlButton(hasQmsc) {
    this.disableSaveXml = !(hasQmsc === GlobalsService.YES);
  }

  public saveXmlFile() {
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
    } else {
      this._updatedAutoFields();
      const result = {
        'MDS_DOSSIER_ENROL': {
          'general_information': this.genInfoModel,
          'dossier': this.dossierModel
        }
      };
      const fileName = this._buildfileName();
      this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    const result = {'MDS_DOSSIER_ENROL': {
      'general_information': this.genInfoModel,
      'dossier': this.dossierModel
    }};
    const version: Array<any> = this.genInfoModel.enrol_version.toString().split('.');
    const fileName = 'draftrepdo-' + version[0] + '-' + version[1];
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
     // console.log('processing file.....');
     console.log(fileData);
    this.genInfoModel = fileData.data.MDS_DOSSIER_ENROL.general_information;
    this.isFinal = (this.genInfoModel.status === GlobalsService.FINAL);
    this.dossierModel = fileData.data.MDS_DOSSIER_ENROL.dossier;
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    if (this.isInternalSite) {
      this.genInfoModel.status = DossierBaseService.setFinalStatus();
      this.genInfoModel.enrol_version = (Math.floor(Number(this.genInfoModel.enrol_version)) + 1).toString() + '.0';
    } else {
      const version: Array<any> = this.genInfoModel.enrol_version.split('.');
      version[1] = (Number(version[1]) + 1).toString();
      this.genInfoModel.enrol_version = version[0] + '.' + version[1];
    }
  }

  private _updatedSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.genInfoModel.last_saved_date = pipe.transform(today, 'yyyy-MM-dd');
  }

  private _buildfileName() {
    const version: Array<any> = this.genInfoModel.enrol_version.split('.');
    if (this.isInternalSite) {
      return 'hcrepdo-' + this.genInfoModel.dossier_id + '-' + version[0] + '-' + version[1];
    } else {
      return 'draftrepdo-' + version[0] + '-' + version[1];
    }
  }
}
