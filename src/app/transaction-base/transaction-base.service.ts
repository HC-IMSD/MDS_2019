import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class TransactionBaseService {


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
      enrolVersion: '0.0',
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(6)]],
      dossierId: ['', [Validators.required, Validators.min(7)]],
      hasDrug: [null, Validators.required],
      hasDinNpn: [null, []],
      din: ['', []],
      complianceUsp: [false, []],
      complianceGmp: [false, []],
      complianceOther: [false, []],
      isListedIddTable: [null, Validators.required]
    });
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyTransactionDetailsModel() {

    return (
      {
        enrol_version: '0.0',
        last_saved_date: '',  // todo: to map into form model ???
        company_id: '',
        dossier_id: '',
        qmsc_number: '',
        licence_application_type: {
            '__text': '',
            '_label_en': '',
            '_label_fr': ''
          },
        is_ivdd: '',
        is_home_use: '',
        is_care_point_use: '',
        is_emit_radiation: '',
        has_drug: '',
        has_din_npn: '',
        din: '',
        npn: '',
        drug_name: '',
        active_ingredients: '',
        manufacturer: '',
        compliance_usp: '',
        compliance_gmp: '',
        compliance_other: '',
        other_pharmacopeia: '',
        provision_mdr_it: '',
        provision_mdr_sa: '',
        authorization_number: '',
        device_id: '',
        declaration_conformity : '',
        has_recombinant: '',
        is_animal_human_sourced : '',
        is_listed_idd_table: ''
      }
    );
  }
}
