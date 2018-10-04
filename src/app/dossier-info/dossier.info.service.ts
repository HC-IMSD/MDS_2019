import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class DossierAppInfoService {
  public statusList: Array<any> = [
    GlobalsService.NEW,
    GlobalsService.AMEND,
    GlobalsService.FINAL
  ];


  constructor() {
  }

  /**
   * Gets the reactive forms Model for applicationInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      formStatus: GlobalsService.NEW,
      enrolVersion: '0.0',
      lastSavedDate: '',
      dossierId: ['', [Validators.required, ValidationService.dossierIdValidator]]
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {
    return (
      {
        status: '',
        enrol_version: '0.0',
        last_saved_date: '',
        dossier_id: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, applicationInfoModel) {
    applicationInfoModel.status = formRecord.controls.formStatus.value;
    applicationInfoModel.enrol_version = formRecord.controls.enrolVersion.value;
    applicationInfoModel.last_saved_date = formRecord.controls.lastSavedDate.value;
    applicationInfoModel.dossier_id = formRecord.controls.dossierId.value;
  }

  public static mapDataModelToFormModel(applicationInfoModel, formRecord: FormGroup) {
    formRecord.controls.formStatus.setValue(applicationInfoModel.status);
    formRecord.controls.enrolVersion.setValue(applicationInfoModel.enrol_version);
    formRecord.controls.lastSavedDate.setValue(applicationInfoModel.last_saved_date);
    formRecord.controls.dossierId.setValue(applicationInfoModel.dossier_id);
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls.id.value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) {return; }
    record.controls.id.setValue(value);
  }

  /**
   * Sets the Final Status
   *
   */
  public static setAmendStatus() {
    return GlobalsService.AMEND;
  }

  public setValidaors(record: FormGroup, eventValue) {
    record.controls.dossierId.setValidators([Validators.required, ValidationService.dossierIdValidator]);
    record.controls.dossierId.updateValueAndValidity();
    return [];
  }


}
