import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class DossierBaseService {


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
      status: '',
      enrolVersion: 0.0,
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(5)]]
    });
  }

  /**
   * Gets an empty Dossier Details Model
   *
   */
  public static getEmptyDossierDetailsModel() {
  // todo: update data fields
    return (
      {
        dossier_type: GlobalsService.DEVICE_TYPE_EN,
        company_id: '',
        contact_id: '',
        device_class: '',
        device_name: '',
        has_qmsc: '',
        registrar: '',
        licence_application_type: '',
        additional_field: ''
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
        status: '',
        enrol_version: '0.0',
        last_saved_date: '',
        dossier_id: ''
      }
    );
  }

  /**
   * Sets the Final Status
   *
   */
  public static setFinalStatus() {

    return GlobalsService.FINAL;
  }
}
