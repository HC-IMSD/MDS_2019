import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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

  // @ViewChildren(AddressListComponent) addressLists: QueryList<AddressListComponent>;
  // @ViewChild(ErrorSummaryComponent) errorSummary: ErrorSummaryComponent;
  @ViewChild('tabs') private tabs: NgbTabset;
  public myForm: FormGroup; // our form model
  public errorList = [];
  public rootTagText = 'DOSSIER_ENROL';
  public testData: ConvertResults = null;
  private _addressErrors = [];
  public _theraErrors = [];
  public countryList = [];
  public title = '';
  // public theraModelList=[ {"id":0,"theraDetails":"Test"}];
  public theraModelList = [];
  public foo = '';

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: CompanyDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    // this.customSettings = tinymceDefaultSettings();

    // this.customSettings.menubar='table';
    // this.customSettings.plugins = 'lists link table';
    dataLoader = new CompanyDataLoaderService(this.http);
    this.countryList = [];
  }

  async ngOnInit() {

    // TO DO get rid of this. Only get the model values
    this.myForm = this._fb.group({
      addresses: this._fb.array([]),
      theraList: this._fb.array([]),
      foo: this._fb.group({myText: ''})

    });
    this.countryList = await (this.dataLoader.getCountries(this.translate.currentLang));
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in Company base component @@@@@@@@@@@@');

    this.errorList = [];
    // concat the two array
    this.errorList = this._addressErrors.concat(this._theraErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processAddressErrors(errorList) {
    this._addressErrors = errorList;
    this.processErrors();
  }

  processTheraErrors(errorList) {
    this._theraErrors = errorList;
    // update values for tab
    for (let err of this._theraErrors) {
      err.tabSet = this.tabs;
      err.tabId = 'tab-thera';
    }


    // TODO how to update the tab titles. Doesn't seem to work in Html
    if (this._theraErrors.length > 0) {
      this.title = 'Errors';
    } else {
      this.title = '';
    }
    // console.log("error lenght"+this._theraErrors.length);
    this.processErrors();
  }

  public hideErrorSummary() {
    if (!this.errorList) {
      return false;
    }
    return this.errorList.length === 0;
  }

  public saveFile() {
    /*let blob = new Blob([document.getElementById('exportDiv').innerHTML], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
    });*/
    let makeStrSave = 'test';

    let fileServices: FileConversionService = new FileConversionService();
    fileServices.saveXmlToFile(this.testData.data, 'testFile', true, null);
  }

  public processFile(data: ConvertResults) {
    // console.log("processing file.....")
    // console.log(data)
    this.testData = data;
  }

  public preload() {
    //console.log("Calling preload")
    this.theraModelList = [{'id': 0, 'theraDetails': 'Test'}];
  }
}
