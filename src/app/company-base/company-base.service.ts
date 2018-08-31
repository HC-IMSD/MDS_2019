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
   * Gets the reactive forms Model for applicationInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      status: {},
      enrolVersion: '0.0',
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
        provText: '',
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
   * Gets an empty app info model
   *
   */
  public static getEmptyAppInfoModel() {
    return (
      {
        status: {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
        enrolVersion: '0.0',
        lastSavedDate: '',
        companyId: ''
      }
    );
  }
}