import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';
import {AddressDetailsService} from './address.details.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';

@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html',
  encapsulation: ViewEncapsulation.None
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public addressFormLocalModel: FormGroup;
  @Input('group') public addressFormRecord: FormGroup;
  @Input() public addressDetailsModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() countryList: Array<any>;
  @Input() provinceList: Array<any>;
  @Input() stateList: Array<any>;
  @Input() addressModel;
  @Input() lang;
  @Input() helpTextSequences;
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public countries: Array<any> = [];
  public provinces: Array<any> = [];
  public provStateList: Array<any> = [];
  public showProvText = true;
  public provinceLabel = 'addressDetails.province';
  public postalPattern: RegExp = null;
  public postalLabel = 'postal.canada';

  public showFieldErrors = false;

  private detailsService: AddressDetailsService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.detailsService = new AddressDetailsService();
  }

  ngOnInit() {
    if (!this.addressFormLocalModel) {
      this.addressFormLocalModel = AddressDetailsService.getReactiveModel(this._fb);
    }
    // this._setCountryState(this.addressFormLocalModel.controls.country.value,this.addressFormLocalModel);
    this.detailsChanged = 0;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);

      /* errorObjs.forEach(
         error => {
           temp.push(error);
         }
       );
       this.errorList.emit(temp);*/
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList.emit(temp);

  }


  ngDoCheck() {
    /*  this.isValid();
      this._syncCurrentExpandedRow();*/
    // this.processCountry()
    // this._setCountryState(event,this.addressFormLocalModel);
  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.addressFormRecord) {
        this._setCountryState(this.addressFormRecord.controls.country.value, this.addressFormRecord);
        this.setToLocalModel();

      } else {
        this.addressFormLocalModel = AddressDetailsService.getReactiveModel(this._fb);
        this._setCountryState(this.addressFormLocalModel.controls.country.value, this.addressFormLocalModel);
        this.addressFormLocalModel.markAsPristine();
      }
    }
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.errorList.emit(temp);
    }
    if (changes['countryList']) {
      this.countries = changes['countryList'].currentValue;
    }
    if (changes['addressFormLocalModel']) {
      console.log('**********the ADDRESS details changed');
      this.addressFormRecord = this.addressFormLocalModel;
    }
    if (changes['addressModel']) {
      const dataModel = changes['addressModel'].currentValue;
      AddressDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.addressFormLocalModel),
        this.countryList, this.provinceList.concat(this.stateList));
      if (this.addressFormLocalModel.controls.country &&
          this.addressFormLocalModel.controls.country.value) {
        this._setCountryState(this.addressFormLocalModel.controls.country.value, this.addressFormLocalModel);
      }
    }
  }


  _setCountryState(countryValue, formModel) {
    // console.log("calling set country");
    // console.log(countryValue);
    let countryJson = null;
    if (isArray(countryValue)) {
      countryJson = countryValue[0];
    } else {
      countryJson = countryValue;
    }
    let provList = this.detailsService.setProvinceState(
      formModel, countryJson, this.provinceList, this.stateList);
    // console.log(provList);
    // this._showProvText(event);
    if (provList.length) {
      this.provStateList = provList;
      this.showProvText = false;
    } else {
      this.showProvText = true;
    }
    this._setPostalPattern(countryValue);
    // update errors manually?
    if (this.showFieldErrors) {
      this.cdr.detectChanges(); // doing our own change detection
    }
  }


  processCountry(event) {
    // console.log(event);
    this.addressFormLocalModel.controls.country.setValue([event]);
    this._setCountryState(event, this.addressFormLocalModel);
    AddressDetailsService.mapFormModelToDataModel((<FormGroup>this.addressFormLocalModel),
      this.addressModel, this.countryList, this.provStateList);
  }


  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.addressFormLocalModel = this.addressFormRecord;
    if (!this.addressFormLocalModel.pristine) {
      this.addressFormLocalModel.markAsPristine();
    }
  }

  // note ng-select expects an array of values even with a single select
  selected(rec) {

    // this.addressFormLocalModel.controls.country.setValue([rec.id]);
    // this.addressFormLocalModel.controls.country.setValue([rec]);
  }

  removed(rec) {
    console.log(rec);
    // this.addressFormLocalModel.controls.country.setValue(null)
  }

  typed(rec) {
    let content = rec.toString().replace(/[\x00-\x7F]/g, '', '');
    // console.log('country is typed');
    if (content && this.existsInList(content)) {
      this.addressFormLocalModel.controls.country.setValue([content]);
      AddressDetailsService.mapFormModelToDataModel((<FormGroup>this.addressFormLocalModel),
        this.addressModel, this.countryList, this.provStateList);
    }
  }

  onblur() {
    // console.log('input is typed');
    AddressDetailsService.mapFormModelToDataModel((<FormGroup>this.addressFormLocalModel),
      this.addressModel, this.countryList, this.provStateList);
  }

  existsInList(rec) {
    for (let country of this.countries) {
      if (country.id === rec) {
        return true;
      }
    }
    return false;
  }

  /* _showProvText(value):boolean{
     console.log(value)
     this.detailsService.setProvinceState(this.addressFormLocalModel, value);
     if(AddressDetailsService.isCanadaOrUSA(value)){
       console.log("hide province text")
       this.showProvText=false;
       return false
     }
     console.log("show province text")
     this.showProvText=true;
     return true;
   }*/

  private _setPostalPattern(countryValue) {
    //  console.log("starting the postal Pattern");
    // this.postalPattern=
    if (AddressDetailsService.isCanada(countryValue)) {

      this.postalLabel = 'postal.canada';
      this.provinceLabel = 'addressDetails.province';
      this.postalPattern = /^(?!.*[DFIOQU])[A-VXYa-vxy][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;
    } else if (AddressDetailsService.isUsa(countryValue)) {
      this.postalPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
      this.postalLabel = 'postal.usa';
      //  console.log("This is the postal label"+this.postalLabel);
      this.provinceLabel = 'addressDetails.state';
    } else {
      this.postalPattern = null;
    }
  }
}

