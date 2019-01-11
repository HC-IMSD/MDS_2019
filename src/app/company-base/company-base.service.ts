import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class CompanyBaseService {


  constructor() {
  }

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      status: '',
      enrolVersion: 0.0,
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(5)]]
    });
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyAddressDetailsModel() {

    return (
      {
        address: '',
        prov_text: '',
        city: '',
        country: {
            '__text': '',
            '_label_en': '',
            '_label_fr': ''
          },
        postal: ''
      }
    );
  }

  /**
   * Gets an empty general info model
   *
   */
  public static getEmptyGenInfoModel() {
    return (
      {
        status: '',
        enrol_version: '0.0',
        last_saved_date: '',
        company_id: ''
      }
    );
  }

  /**
   * Sets the Final Status
   *
   */
  public static setFinalStatus() {

    return 'FINAL';
  }
}
