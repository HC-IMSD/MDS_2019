import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class AddressDetailsService {

  private countryList: Array<any>;
  private stateList: Array<any>;
  public provinces: Array<any> = [];


  constructor() {
    this.countryList = [];
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) return null;
    return fb.group({
      address: [null, Validators.required],
      provText: '',
      provList: '',
      city: ['', [Validators.required, Validators.min(5)]],
      country: [null, [Validators.required, ValidationService.countryValidator]],
      postal: ['', []]
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        address: '',
        prov_lov: '',
        prov_text: '',
        city: '',
        country: '',
        postal: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, addressModel, countryList) {
    addressModel.address = formRecord.controls.address.value;
    addressModel.city = formRecord.controls.city.value;
    if (formRecord.controls.country.value && formRecord.controls.country.value.length > 0) {
      const country_record = AddressDetailsService.findRecordByTerm(countryList, formRecord.controls.country.value[0], 'id');
      // this removes the 'text' property that the control needs
      if (country_record && country_record.id) {
        addressModel.country = {
          '__text': country_record.id,
          '_label_en': country_record.en,
          '_label_fr': country_record.fr
        };
      } else {
        addressModel.country = null;
      }
    } else {
      addressModel.country = null;
    }
    addressModel.postal = formRecord.controls.postal.value;
    addressModel.prov_lov = formRecord.controls.provList.value;
    addressModel.prov_text = formRecord.controls.provText.value;
  }

  public static mapDataModelToFormModel(addressModel, formRecord: FormGroup, countryList) {
    formRecord.controls.address.setValue(addressModel.address);
    formRecord.controls.city.setValue(addressModel.city);
    formRecord.controls.postal.setValue(addressModel.postal);
    const recordIndex = ListService.getRecord(countryList, addressModel.country.__text, 'id');
    let labelText = '';
    if (recordIndex > -1) {
      labelText = countryList[recordIndex].text;
    }
    if (addressModel.country) {
      formRecord.controls.country.setValue([
        {
          'id': addressModel.country.__text,
          'text': labelText
        }
      ]);

      if (AddressDetailsService.isCanada(addressModel.country.__text) ||
          AddressDetailsService.isUsa(addressModel.country.__text)) {
        formRecord.controls.provList.setValue(addressModel.prov_lov);
      } else {
        formRecord.controls.provText.setValue(addressModel.prov_text);
      }
    } else {
      formRecord.controls.country.setValue(null);
    }
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls.id.value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) return;
    record.controls.id.setValue(value);
  }

  public setProvinceState(record: FormGroup, eventValue, provList, stateList) {

    if (AddressDetailsService.isCanadaOrUSA(eventValue)) {

      record.controls.provText.setValue('');
      record.controls.provList.setValidators([Validators.required]);

      if (AddressDetailsService.isCanada(eventValue.id)) {
        record.controls.postal.setValidators([Validators.required, ValidationService.canadaPostalValidator]);
        this.provinces = provList;
      } else {
        record.controls.postal.setValidators([Validators.required, ValidationService.usaPostalValidator]);
        this.provinces = stateList;
      }
      record.controls.provList.updateValueAndValidity();
      record.controls.postal.updateValueAndValidity();
      return this.provinces;
    } else {
      record.controls.provList.setValidators([]);
      record.controls.provList.setValue('');
      record.controls.postal.setValidators([]);
      record.controls.provList.updateValueAndValidity();
      record.controls.postal.updateValueAndValidity();
      return [];
    }

  }

  /**
   * Sets the country list to be used for all addres details records
   * @param {Array<any>} value
   */
  public setCountryList(value: Array<any>) {
    this.countryList = value;

  }

  public static isCanadaOrUSA(value) {
    let countryValue: string;
    if (value) {
      countryValue = value.id;
    } else {
      return false;
    }
    return (AddressDetailsService.isCanada(countryValue) || AddressDetailsService.isUsa(countryValue));
  }

  /**
   * Checks of the value is canada or not. Checks for Json object vs single value
   * @param value the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  public static isCanada(value) {
    let updatedValue = '';
    if (value && value.id) {
      updatedValue = value.id;
    } else {
      updatedValue = value;
    }
    return (updatedValue === GlobalsService.CANADA);
  }

  /**
   * Checks if the value usa or not. Checks for Json object vs single value
   * @param value - the value to check can be the json object with an id index.
   * @returns {boolean}
   */
  public static isUsa(value) {
    let updatedValue = '';
    if (value && value.id) {
      updatedValue = value.id;
    } else {
      updatedValue = value;
    }
    return (updatedValue === GlobalsService.USA);
  }

  /**
   * Find a record by its unique id,. If a dup, returns first instance
   * @param list
   * @param criteria
   * @returns {any}
   */
  public static findRecordByTerm(list, criteria, searchTerm) {

    let result = list.filter(
      item => item[searchTerm] === criteria[searchTerm]);
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

}
