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
      dossierId: [null, [Validators.required, ValidationService.dossierIdValidator]],
      dossierType: ['Medical device', []],
      manuCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      manuContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      reguCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      reguContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      activityLead: [null, Validators.required],
      activityType: [null, Validators.required],
      transDescription: [null, Validators.required],
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
      hasDdt: [false, []],
      hasAppInfo: [false, []],
      isSolicitedInfo: [null, Validators.required]
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
        dossier_id: '',
        dossier_type: 'Medical Device',
        manufacturing_company_id: '',
        manufacturing_contact_id: '',
        regulatory_company_id: '',
        regulatory_contact_id: '',
        activity_lead: '',
        activity_type: '',
        transaction_description: '',
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
        has_ddt: '',
        has_app_info: '',
        is_solicited_info: ''
      }
    );
  }
}
