import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class ApplicationInfoBaseService {


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
      mdsapNum: [null, Validators.required],
      mdsapOrg: [null, Validators.required],
      licenceAppType: [null, Validators.required],
      activityLead: [null, Validators.required],
      activityType: [null, Validators.required],
      deviceClass: [null, Validators.required],
      isIvdd: [null, Validators.required],
      isHomeUse: [null, Validators.required],
      isCarePoint: [null, Validators.required],
      isEmitRadiation: [null, Validators.required],
      hasDrug: [null, Validators.required],
      hasDinNpn: [null, []],
      din: ['', [Validators.required, Validators.min(8)]],
      npn: ['', [Validators.required, Validators.min(8)]],
      drugName: [null, Validators.required],
      activeIngredients: [null, Validators.required],
      manufacturer: [null, Validators.required],
      hasCompliance: [null, Validators.required],
      complianceUsp: [false, []],
      complianceGmp: [false, []],
      complianceOther: [false, []],
      otherPharmacopeia: [null, Validators.required],
      provisionMdrIT: [false, []],
      provisionMdrSA: [false, []],
      applicationNum: ['', []],
      sapReqNum: ['', []],
      declarationConformity : [null, Validators.required],
      hasRecombinant: [null, Validators.required],
      isAnimalHumanSourced : [null, Validators.required],
      hasMaterial: [null, Validators.required],
      isListedIddTable: [null, Validators.required]
    });
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyAppInfoDetailsModel() {

    return (
      {
        enrol_version: '0.0',
        last_saved_date: '',  // todo: to map into form model ???
        company_id: '',
        dossier_id: '',
        mdsap_number: '',
        mdsap_org: {
          '__text': '',
          '_label_en': '',
          '_label_fr': ''
        },
        licence_application_type: {
            '__text': '',
            '_label_en': '',
            '_label_fr': ''
          },
        regulatory_activity_lead: {
          '__text': '',
          '_label_en': '',
          '_label_fr': ''
        },
        regulatory_activity_type: {
          '__text': '',
          '_label_en': '',
          '_label_fr': ''
        },
        device_class: {
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
        application_number: '',
        sap_request_number: '',
        declaration_conformity : '',
        has_recombinant: '',
        is_animal_human_sourced : '',
        is_listed_idd_table: ''
      }
    );
  }

  /**
   * Sets the Help Text Index
   *
   */
  public static getHelpTextIndex() {

    const helpTextInx = {
      loadFileIndx: 0,
      appInfoREPIndx: 0,
      mdsapNumIndx: 0,
      licAppTypeIndx: 0,
      mdsapOrgIndx: 0,
      devClsIndx: 0,
      cfmDecIndx: 0
    };
    const keys = Object.keys(helpTextInx);
    for (let i = 0; i < keys.length; i++) {
      helpTextInx[keys[i]] = i + 1;
    }

    return helpTextInx;
  }
}
