import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class MasterFileBaseService {


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
      softwareVersion: GlobalsService.SOFTWARE_VERSION,
      enrolVersion: '0.0',
      lastSavedDate: '',
      dossierId: [null, [Validators.required, ValidationService.dossierIdValidator]],
      dossierType: ['Medical device', []],
      manuCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      manuContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      reguCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      reguContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      activityLead: [null, Validators.required],
      activityType: [null, Validators.required],
      descriptionType: [null, Validators.required],
      deviceClass: [null, Validators.required],
      amendReason: [null, Validators.required],
      classChange: [false, []],
      licenceChange: [false, []],
      processChange: [false, []],
      qualityChange: [false, []],
      designChange: [false, []],
      materialsChange: [false, []],
      labellingChange: [false, []],
      safetyChange: [false, []],
      purposeChange: [false, []],
      addChange: [false, []],
      licenceNum: [null, [Validators.required, ValidationService.licenceNumValidator]],
      appNum: [null, [Validators.required, ValidationService.appNumValidator]],
      deviceName: [null, Validators.required],
      requestDate: [null, Validators.required],
      transDescription: [null, []],
      hasDdt: [false, []],
      hasAppInfo: [false, []],
      isSolicitedInfo: [null, Validators.required]
    });
  }

  public static getEmptyMasterFileFeeModel() {
    return (
      {
        has_fees: '',
        billing_company_id: '',
        billing_contact_id: ''
      }
    );
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyMasterFileDetailsModel() {

    return (
      {
        software_version: GlobalsService.SOFTWARE_VERSION,
        enrol_version: '0.0',
        last_saved_date: '',  // todo: to map into form model ???
        dossier_id: '',
        dossier_type: 'Medical Device',
        company_id: '',
        manufacturing_contact_id: '',
        regulatory_company_id: '',
        regulatory_contact_id: '',
        regulatory_activity_lead: '',
        regulatory_activity_type: '',
        description_type: '',
        device_class: '',
        amend_reasons: {
          classification_change: '',
          licence_change: '',
          process_change: '',
          quality_change: '',
          design_change: '',
          materials_change: '',
          labelling_change: '',
          safety_change: '',
          purpose_change: '',
          add_delete_change: ''
        },
        licence_number: '',
        application_number: '',
        device_name: '',
        request_date: '',
        master_file_description: '',
        has_ddt: '',
        has_app_info: '',
        is_solicited_info: '',
        org_manufacture_id: '',
        org_manufacture_lic: ''
      }
    );
  }
  /**
   * Sets the Help Text Index
   *
   */
  public static getHelpTextIndex() {

    const helpTextInx = {
      loadFileInx: 0,
      tr2: 0,
      tr3: 0,
      tr2a: 0,
      tr2b: 0,
      tr2c: 0,
      tr4: 0,
      tr5: 0
    };
    const keys = Object.keys(helpTextInx);
    for (let i = 0; i < keys.length; i++) {
      helpTextInx[keys[i]] = i + 1;
    }

    return helpTextInx;
  }

}
