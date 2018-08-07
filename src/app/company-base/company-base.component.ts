import {ChangeDetectorRef, Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDataLoaderService} from '../data-loader/company-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'company-base',
  templateUrl: './company-base.component.html',
  styleUrls: ['./company-base.component.css']
})

export class CompanyBaseComponent implements OnInit {
  public errors;
  @Input() isInternal: boolean;
  @ViewChild('tabs') private tabs: NgbTabset;

  public errorList = [];
  public rootTagText = 'COMPANY_ENROL';
  public testData: ConvertResults = null;
  private _addressErrors = [];
  // public _theraErrors = [];
  private _AppInfoErrors = [];
  public countryList = [];
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h1';
  // public theraModelList=[ {"id":0,"theraDetails":"Test"}];
  // public theraModelList = [];
  public addressModel;
  public appInfoModel: FormGroup;
  public contactModel = [];
  public foo = '';
  public fileServices: FileConversionService;

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: CompanyDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    dataLoader = new CompanyDataLoaderService(this.http);
    this.countryList = [];
    this.showErrors = false;
    this.fileServices = new FileConversionService();
  }

  async ngOnInit() {
    this.countryList = await (this.dataLoader.getCountries(this.translate.currentLang));
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in Company base component @@@@@@@@@@@@');

    this.errorList = [];
    // concat the two array
    this.errorList = this._addressErrors.concat(this._AppInfoErrors); // .concat(this._theraErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processAddressErrors(errorList) {
    this._addressErrors = errorList;
    this.processErrors();
  }

  processAppInfoErrors(errorList) {
    this._AppInfoErrors = errorList;
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
    if (!this.errorList) {
      return false;
    }
    return this.errorList.length === 0;
  }

  public saveXmlFile() {
    const result = {'CO': {
      'address': this.addressModel,
      'application_information': this.appInfoModel,
      'contacts': this.contactModel
    }};
    this.fileServices.saveXmlToFile(result, 'hcmdsco', true, null);
  }

  public saveWorkingCopyFile() {
    const result = {'CO': {
      'application_information': this.appInfoModel,
      'address': this.addressModel,
      'contacts': this.contactModel
    }};
    this.fileServices.saveJsonToFile(result, 'hcmdsco-test', null);
  }

  public processFile(data: ConvertResults) {
    // console.log("processing file.....")
    // console.log(data)
    this.testData = data;
  }

  public preload() {
    // console.log("Calling preload")
   // this.theraModelList = [{'id': 0, 'theraDetails': 'Test'}];
  }

  public loadAddressData() {
    const modelData3 = {
        'id': 124,
        'company': 'asdaa',
        'address': 'adasd',
        'provText': '',
        'provList': '',
        'city': 'asdas',
        'country': {
          '__text': 'AIA',
          '_label_en': 'Anguilla',
          '_label_fr': 'Anguilla'
        },
        'postal': ''
      };
    this.addressModel = modelData3;
  }


}
