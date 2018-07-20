import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class ContactDetailsService {

  private countryList: Array<any>;
  private stateList: Array<any>;
  public provinces: Array<any> = [
    {'id': 'ON', 'label_en': 'Ontario', 'label_fr': 'Ontario'},
    {'id': 'MN', 'label_en': 'Manitoba', 'label_fr': 'Manitoba'}
  ];


  constructor() {
    this.countryList = [];
  }

  /**
   * Gets the reactive forms Model for contact details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      contact: [null, Validators.required],
      provText: '',
      provList: '',
      city: ['', [Validators.required, Validators.min(5)]],
      country: [null, Validators.required],
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
        contact: '',
        provText: '',
        provList: '',
        city: '',
        country: '',
        postal: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, contactModel) {
    contactModel.contact = formRecord.controls.contact.value;
    contactModel.city = formRecord.controls.city.value;
    contactModel.postal = formRecord.controls.postal.value;
    contactModel.provList = formRecord.controls.provList.value;
    contactModel.provText = formRecord.controls.provText.value;
  }

  public static mapDataModelToFormModel(contactModel, formRecord: FormGroup) {
    formRecord.controls.contact.setValue(contactModel.contact);
    formRecord.controls.city.setValue(contactModel.city);
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls.id.value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) {
      return;
    }
    record.controls.id.setValue(value);
  }

  public setProvinceState(record: FormGroup, eventValue) {

    if (ContactDetailsService.isCanadaOrUSA(eventValue)) {

      record.controls.provText.setValue('');
      record.controls.provList.setValidators([Validators.required]);

      if (ContactDetailsService.isCanada(eventValue.id)) {
        record.controls.postal.setValidators([Validators.required, ValidationService.canadaPostalValidator]);
      } else {
        record.controls.postal.setValidators([Validators.required, ValidationService.usaPostalValidator]);
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
    return (ContactDetailsService.isCanada(countryValue) || ContactDetailsService.isUsa(countryValue));
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
