import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';

@Component({
  selector: 'company-base',
  templateUrl: './company-base.component.html',
  styleUrls: ['./company-base.component.css']
})

export class CompanyBaseComponent implements OnInit {
  public errors;

  // @ViewChildren(AddressListComponent) addressLists: QueryList<AddressListComponent>;
  //@ViewChild(ErrorSummaryComponent) errorSummary: ErrorSummaryComponent;

  public myForm: FormGroup; // our form model
  public errorList = [];
  public  rootTagText="DOSSIER_ENROL";
  public testData:ConvertResults=null;
  private _addressErrors=[];
  private _theraErrors=[];

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      addresses: this._fb.array([])
    });
  }

  ngAfterViewInit() {

    /* this.addressLists.changes.subscribe(list => {
       list.forEach(writer => console.log(writer));
     });*/
  }

  initAddress() {
    // initialize our address
    // this.indexId++;
    return this._fb.group({
      id: [14],
      address: ['test1', Validators.required],
      city: ['test1']
    });
  }

  processErrors() {
    console.log('@@@@@@@@@@@@ Processing errors in Company base component @@@@@@@@@@@@');

    this.errorList = [];
    //concat the two array
    this.errorList=this._addressErrors.concat(this._theraErrors);
    this.cdr.detectChanges(); //doing our own change detection
  }

  processAddressErrors(errorList){
    this._addressErrors=errorList;
    this.processErrors();
  }
  processTheraErrors(errorList){
    this._theraErrors=errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    if (!this.errorList) return false;
    return this.errorList.length == 0;
  }

  public saveFile() {
    /*let blob = new Blob([document.getElementById('exportDiv').innerHTML], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
    });*/
    var makeStrSave = 'test';

    let  fileServices:FileConversionService =new FileConversionService();
    fileServices.saveXmlToFile( this.testData.data,'testFile',true,null);
  }
  public processFile(data:ConvertResults){
    console.log("processing file.....")
    console.log(data)
    this.testData=data;
  }
}