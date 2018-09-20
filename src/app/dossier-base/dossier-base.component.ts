import {ChangeDetectorRef, Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {DossierBaseService} from './dossier-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {DossierDataLoaderService} from '../data-loader/dossier-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

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
  public rootTagText = 'COMPANY_ENROL';
  public isInternalSite = false;
  public registrarList = [];
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';
  public dossierModel = DossierBaseService.getEmptyAddressDetailsModel();
  public appInfoModel = DossierBaseService.getEmptyAppInfoModel();
  public fileServices: FileConversionService;
  public saveXmlLabel = 'save.draft';
  public xslName = 'REP_MDS_DO_1_0.xsl';

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    dataLoader = new DossierDataLoaderService(this.http);
    this.registrarList = [];
    this.showErrors = false;
    this.fileServices = new FileConversionService();
  }

  async ngOnInit() {
    if (!this.dossierForm) {
      this.dossierForm = DossierBaseService.getReactiveModel(this._fb);
    }
    this.registrarList = await (this.dataLoader.getRegistrars(this.translate.currentLang));
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
      if (this.isInternalSite) {
        this.appInfoModel.status = DossierBaseService.setFinalStatus();
      }
      const result = {
        'COMPANY_ENROL': {
          'application_information': this.appInfoModel,
          'dossier': this.dossierModel
        }
      };
      this.fileServices.saveXmlToFile(result, 'hcmdsco', true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    const result = {'COMPANY_ENROL': {
      'application_information': this.appInfoModel,
      'dossier': this.dossierModel
    }};
    this.fileServices.saveJsonToFile(result, 'hcmdsco-test', null);
  }

  public processFile(fileData: ConvertResults) {
     console.log('processing file.....');
     console.log(fileData);
    this.appInfoModel = fileData.data.COMPANY_ENROL.application_information;
    this.isFinal = (this.appInfoModel.status === GlobalsService.FINAL);
    this.dossierModel = fileData.data.COMPANY_ENROL.dossier;
  }


}
