import {ChangeDetectorRef, Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {CompanyBaseService} from './company-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDataLoaderService} from '../data-loader/company-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'company-base',
  templateUrl: './company-base.component.html',
  styleUrls: ['./company-base.component.css']
})

export class CompanyBaseComponent implements OnInit {
  public errors;
  @Input() isInternal;
  @Input() lang;
  @ViewChild('tabs') private tabs: NgbTabset;

  private _genInfoErrors = [];
  private _addressErrors = [];
  public isFinal = false;
  public companyForm: FormGroup;
  public errorList = [];
  public rootTagText = 'DEVICE_COMPANY_ENROL';
  public isInternalSite = false;
  // public testData: ConvertResults = null;
  // public _theraErrors = [];
  private _contactErrors = [];
  public countryList = [];
  public provinceList = [];
  public stateList = [];
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';
  // public theraModelList=[ {"id":0,"theraDetails":"Test"}];
  // public theraModelList = [];
  public addressModel = CompanyBaseService.getEmptyAddressDetailsModel();
  public genInfoModel = CompanyBaseService.getEmptyGenInfoModel();
  public contactModel = [];
  public foo = '';
  public fileServices: FileConversionService;
  public saveXmlLabel = 'save.draft';
  public xslName = 'REP_MDS_CO_1_0.xsl';

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: CompanyDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    dataLoader = new CompanyDataLoaderService(this.http);
    this.countryList = [];
    this.showErrors = false;
    this.fileServices = new FileConversionService();
  }

  async ngOnInit() {
    if (!this.companyForm) {
      this.companyForm = CompanyBaseService.getReactiveModel(this._fb);
    }
    this.countryList = await (this.dataLoader.getCountries(this.translate.currentLang));
    this.provinceList = await (this.dataLoader.getProvinces(this.translate.currentLang));
    this.stateList = await (this.dataLoader.getStates(this.translate.currentLang));
    // console.log('isInternal in ngOnInit: ' + this.isInternal);
    if (this.isInternal === GlobalsService.YES) {
      this.isInternalSite = true;
      // console.log('isInternalSite in ngOnInit: ' + this.isInternalSite);
      this.saveXmlLabel = 'approve.final';
    }
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in Company base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._genInfoErrors.concat(this._addressErrors.concat(this._contactErrors)); // .concat(this._theraErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processAddressErrors(errorList) {
    this._addressErrors = errorList;
    this.processErrors();
  }

  processGenInfoErrors(errorList) {
    this._genInfoErrors = errorList;
    this.processErrors();
  }

  processContactErrors(errorList) {
    this._contactErrors = errorList;
    this.processErrors();
  }

  // processTheraErrors(errorList) {
  //   this._theraErrors = errorList;
  //   // update values for tab
  //   for (let err of this._theraErrors) {
  //     err.tabSet = this.tabs;
  //     err.tabId = 'tab-thera';
  //   }
  //
  //
  //   // TODO how to update the tab titles. Doesn't seem to work in Html
  //   if (this._theraErrors.length > 0) {
  //     this.title = 'Errors';
  //   } else {
  //     this.title = '';
  //   }
  //   // console.log("error lenght"+this._theraErrors.length);
  //   this.processErrors();
  // }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
    // if (!this.errorList) {
    //   return false;
    // }
    // return this.errorList.length === 0;
  }

  public saveXmlFile() {
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
    } else {
      if (this.isInternalSite) {
        this.genInfoModel.status = CompanyBaseService.setFinalStatus();
      }
      const result = {
        'DEVICE_COMPANY_ENROL': {
          'general_information': this.genInfoModel,
          'address': this.addressModel,
          'contacts': {
            'contact': this.contactModel
          }
        }
      };
      this.fileServices.saveXmlToFile(result, 'hcmdsco', true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    const result = {'DEVICE_COMPANY_ENROL': {
      'general_information': this.genInfoModel,
      'address': this.addressModel,
      'contacts': {
        'contact': this.contactModel
      }
    }};
    this.fileServices.saveJsonToFile(result, 'hcmdsco-test', null);
  }

  public processFile(fileData: ConvertResults) {
     console.log('processing file.....');
     console.log(fileData);
    this.genInfoModel = fileData.data.DEVICE_COMPANY_ENROL.general_information;
    this.isFinal = (this.genInfoModel.status === GlobalsService.FINAL);
    this.addressModel = fileData.data.DEVICE_COMPANY_ENROL.address;
    const cont = fileData.data.DEVICE_COMPANY_ENROL.contacts.contact;
    this.contactModel = (cont instanceof Array) ? cont : [cont];

    // this.testData = fileData.data;
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    if (this.isInternalSite) {
      this.genInfoModel.status = CompanyBaseService.setFinalStatus();
      this.genInfoModel.enrolVersion = Math.floor(this.genInfoModel.enrolVersion) + 1;
    } else {
      this.genInfoModel.enrolVersion += 0.1;
    }
  }

  private _updatedSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.genInfoModel.lastSavedDate = pipe.transform(today, 'yyyy-MM-dd');
  }

  public preload() {
    // console.log("Calling preload")
   // this.theraModelList = [{'id': 0, 'theraDetails': 'Test'}];
  }

  public updateChild() {
    // console.log("Calling updateChild")
  }

  // public loadAddressData() {
  //   const modelData3 = {
  //       'id': 124,
  //       'company': 'asdaa',
  //       'address': 'adasd',
  //       'provText': '',
  //       'provList': '',
  //       'city': 'asdas',
  //       'country': {
  //         '__text': 'AIA',
  //         '_label_en': 'Anguilla',
  //         '_label_fr': 'Anguilla'
  //       },
  //       'postal': ''
  //     };
  //   this.addressModel = modelData3;
  // }


}
