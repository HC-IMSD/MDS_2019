import {ChangeDetectorRef, Component, OnInit, ViewChild, Input, ViewEncapsulation, HostListener} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {ApplicationInfoBaseService} from './application-info-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
import {ApplicationInfoDetailsComponent} from '../application-info-details/application-info.details.component';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDataLoaderService} from '../data-loader/company-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-info-base',
  templateUrl: './application-info-base.component.html',
  styleUrls: ['./application-info-base.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ApplicationInfoBaseComponent implements OnInit {
  public errors;
  @Input() isInternal;
  @Input() lang;
  @ViewChild(ApplicationInfoDetailsComponent, {static: false}) aiDetails: ApplicationInfoDetailsComponent;

  private _appInfoDetailErrors = [];
  private _deviceErrors = [];
  private _materialErrors = [];
  public appInfoForm: FormGroup;  // todo: do we need it? could remove?
  public errorList = [];
  public rootTagText = 'DEVICE_APPLICATION_INFO';
  public countryList = [];
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';
  public appInfoModel = ApplicationInfoBaseService.getEmptyAppInfoDetailsModel();
  public helpIndex = ApplicationInfoBaseService.getHelpTextIndex();
  public deviceModel = [];
  public materialModel = [];
  public fileServices: FileConversionService;
  public xslName = 'REP_MDS_AI_2_0.xsl';
  public disableSaveXml = true;

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: CompanyDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    dataLoader = new CompanyDataLoaderService(this.http);
    this.countryList = [];
    this.showErrors = false;
    this.fileServices = new FileConversionService();
  }

  async ngOnInit() {
    if (!this.appInfoForm) {
      this.appInfoForm = ApplicationInfoBaseService.getReactiveModel(this._fb);
    }
    this.countryList = await (this.dataLoader.getCountries(this.translate.currentLang));
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in ApplicationInfo base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._appInfoDetailErrors.concat(this._deviceErrors.concat(this._materialErrors)); // .concat(this._theraErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processDetailErrors(errorList) {
    this._appInfoDetailErrors = errorList;
    this.processErrors();
  }

  processDeviceErrors(errorList) {
    this._deviceErrors = errorList;
    this.processErrors();
  }

  processMaterialtErrors(errorList) {
    this._materialErrors = errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
    // if (!this.errorList) {
    //   return false;
    // }
    // return this.errorList.length === 0;
  }

  private _checkMaterialModel() {
    if (this.appInfoModel.is_animal_human_sourced !== GlobalsService.YES) {
      this.materialModel = [];
    }
  }

  disableSaveXmlButton(declarationConformity) {
    // console.log('declarationConformity' + declarationConformity);
    this.disableSaveXml = !(declarationConformity === GlobalsService.YES);
  }

  public saveXmlFile() {
    this._updatedAutoFields();
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
      document.location.href = '#topErrorSummary';
    } else {
      if (this._hasUnsavedInput()) {
        this._checkMaterialModel();
        const result = {
          'DEVICE_APPLICATION_INFO': {
            'application_info': this.appInfoModel,
            'devices': {
              'device': this.deviceModel
            },
            'materials': {
              'material': this.materialModel
            }
          }
        };
        const fileName = 'ai-' + this.appInfoModel.dossier_id + '-' + this.appInfoModel.last_saved_date;
        this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
      } else {
        if (this.lang === GlobalsService.ENGLISH) {
          alert('Please save the unsaved input data before generating XML file.');
        } else {
          alert('Veuillez sauvegarder les données d\'entrée non enregistrées avant de générer le fichier XML.');
        }
      }
    }
  }

  private _hasUnsavedInput() {
    if (this.aiDetails.bioMaterials) {
      return (this.aiDetails.aiDevices.deviceListForm.pristine &&
        (this.aiDetails.bioMaterials.materialListForm ? this.aiDetails.bioMaterials.materialListForm.pristine : true) &&
        (this.aiDetails.bioMaterials.newMaterialForm ? this.aiDetails.bioMaterials.newMaterialForm.pristine : true));
    } else {
      return this.aiDetails.aiDevices.deviceListForm.pristine;
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    this._checkMaterialModel();
    const result = {'DEVICE_APPLICATION_INFO': {
      'application_info': this.appInfoModel,
      'devices': {
        'device': this.deviceModel
      },
      'materials': {
        'material': this.materialModel
      }
    }};
    const fileName = 'ai-' + this.appInfoModel.dossier_id + '-' + this.appInfoModel.last_saved_date;
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
     console.log('processing file.....');
     console.log(fileData);
    this.appInfoModel = fileData.data.DEVICE_APPLICATION_INFO.application_info;
    const dev = fileData.data.DEVICE_APPLICATION_INFO.devices.device;
    if (dev) {
      this.deviceModel = (dev instanceof Array) ? dev : [dev];
    }
    const mat = fileData.data.DEVICE_APPLICATION_INFO.materials.material;
    if (mat) {
      this.materialModel = (mat instanceof Array) ? mat : [mat];
    }
  }

  private _updatedSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.appInfoModel.last_saved_date = pipe.transform(today, 'yyyy-MM-dd-hhmm');
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    const version: Array<any> = this.appInfoModel.enrol_version.split('.');
    version[0] = (Number(version[0]) + 1).toString();
    this.appInfoModel.enrol_version = version[0] + '.' + version[1];
  }

  public preload() {
    // console.log("Calling preload")
  }

  public updateChild() {
    // console.log("Calling updateChild")
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

}
