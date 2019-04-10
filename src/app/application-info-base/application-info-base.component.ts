import {ChangeDetectorRef, Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {ApplicationInfoBaseService} from './application-info-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDataLoaderService} from '../data-loader/company-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-info-base',
  templateUrl: './application-info-base.component.html',
  styleUrls: ['./application-info-base.component.css']
})

export class ApplicationInfoBaseComponent implements OnInit {
  public errors;
  @Input() isInternal;
  @Input() lang;

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
  public deviceModel = [];
  public materialModel = [];
  public fileServices: FileConversionService;
  public xslName = GlobalsService.STYLESHEETS_1_0_PREFIX + 'REP_MDS_AI_1_0.xsl';

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

  public saveXmlFile() {
    this._updatedAutoFields();
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
    } else {
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
      const fileName = 'hcrepaim-' + this.appInfoModel.last_saved_date;
      this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    const result = {'DEVICE_APPLICATION_INFO': {
      'application_info': this.appInfoModel,
      'devices': {
        'device': this.deviceModel
      },
      'materials': {
        'material': this.materialModel
      }
    }};
    const fileName = 'hcrepaim-' + this.appInfoModel.last_saved_date;
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

}
