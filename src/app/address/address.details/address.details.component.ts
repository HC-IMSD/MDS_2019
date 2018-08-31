import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';
import {AddressDetailsService} from './address.details.service';
import {isArray} from 'util';
import {noUndefined} from "@angular/compiler/src/util";


@Component({
  selector: 'address-details',
  templateUrl: 'address.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class AddressDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public adressFormLocalModel: FormGroup;
  @Input('group') public adressFormRecord: FormGroup;
  @Input() public addressDetailsModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() countryList: Array<any>;
  @Input() addressModel;
  @Output() errorList = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public countries: Array<any> = [];
  public provinces: Array<any> = [
    {'id': 'ON', 'label_en': 'Ontario', 'label_fr': 'Ontario'},
    {'id': 'MN', 'label_en': 'Manitoba', 'label_fr': 'Manitoba'}
  ];
  public showProvText = true;
  public provinceLabel = 'addressDetails.province';
  public postalPattern: RegExp = null;
  public postalLabel = 'postal.canada';

  public showFieldErrors = false;

  private detailsService: AddressDetailsService;
  public stateList: Array<any>;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.detailsService = new AddressDetailsService();
  }

  ngOnInit() {
    if (!this.adressFormLocalModel) {
      this.adressFormLocalModel = AddressDetailsService.getReactiveModel(this._fb);
    }
    // this._setCountryState(this.adressFormLocalModel.controls.country.value,this.adressFormLocalModel);
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
    // this._setCountryState(event,this.adressFormLocalModel);
  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.adressFormRecord) {
        this._setCountryState(this.adressFormRecord.controls.country.value, this.adressFormRecord);
        this.setToLocalModel();

      } else {
        this.adressFormLocalModel = AddressDetailsService.getReactiveModel(this._fb);
        this._setCountryState(this.adressFormLocalModel.controls.country.value, this.adressFormLocalModel);
        this.adressFormLocalModel.markAsPristine();
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
    if (changes['adressFormLocalModel']) {
      console.log('**********the ADDRESS details changed');
      this.adressFormRecord = this.adressFormLocalModel;
    }
    if (changes['addressModel']) {
      const dataModel = changes['addressModel'].currentValue;
      AddressDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.adressFormLocalModel),
        this.countryList);
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
    let provList = this.detailsService.setProvinceState(formModel, countryJson);
    // console.log(provList);
    // this._showProvText(event);
    if (provList.length) {
      this.stateList = provList;
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
    this._setCountryState(event, this.adressFormLocalModel);
    AddressDetailsService.mapFormModelToDataModel((<FormGroup>this.adressFormLocalModel),
      this.addressModel, this.countryList);
  }


  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.adressFormLocalModel = this.adressFormRecord;
    if (!this.adressFormLocalModel.pristine) {
      this.adressFormLocalModel.markAsPristine();
    }
  }

  // note ng-select expects an array of values even with a single select
  selected(rec) {

    // this.adressFormLocalModel.controls.country.setValue([rec.id]);
    // this.adressFormLocalModel.controls.country.setValue([rec]);
  }

  removed(rec) {
    console.log(rec);
    // this.adressFormLocalModel.controls.country.setValue(null)
  }

  typed(rec) {
    let content = rec.toString().replace(/[\x00-\x7F]/g, '', '');
    console.log('country is typed');
    if (content && this.existsInList(content)) {
      this.adressFormLocalModel.controls.country.setValue([content]);
      AddressDetailsService.mapFormModelToDataModel((<FormGroup>this.adressFormLocalModel),
        this.addressModel, this.countryList);
    }
  }

  onblur() {
    console.log('input is typed');
    AddressDetailsService.mapFormModelToDataModel((<FormGroup>this.adressFormLocalModel),
      this.addressModel, this.countryList);
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
     this.detailsService.setProvinceState(this.adressFormLocalModel, value);
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

