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
        company_name: '',
        address: '',
        city: '',
        country: {
          '__text': '',
          '_id': '',
          '_label_en': '',
          '_label_fr': ''
        },
        prov_lov: {
          '__text': '',
          '_id': '',
          '_label_en': '',
          '_label_fr': ''
        },
        prov_text: '',
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
        company_id: '',
        amend_reasons: {
          manufacturer_name_change: '',
          manufacturer_address_change: '',
          facility_change: '',
          other_change: '',
          other_details: ''
        },
        are_licenses_transfered: ''
      }
    );
  }

  /**
   * Gets an empty Admin Changes Model
   *
   */
  public static getEmptyAdminChangesModel() {

    return (
      {
        all_licence_numbers: '',
        is_regulatory_change: '',
        new_company_id: '',
        new_contact_id: '',
        new_contact_name: ''
      }
    );
  }

  /**
   * Gets an empty Admin Changes Model
   *
   */
  public static getEmptyPrimarycontactModel() {

    return (
      {
        is_third_party: '',
        rep_contact_company_id: '',
        rep_contact_id: '',
        rep_contact_name: ''
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
