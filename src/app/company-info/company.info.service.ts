import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class CompanyInfoService {
  public statusList: Array<any> = [
    GlobalsService.NEW,
    GlobalsService.AMEND,
    GlobalsService.FINAL
  ];


  constructor() {
  }

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      formStatus: GlobalsService.NEW,
      enrolVersion: '0.1',
      lastSavedDate: '',
      companyId: ['', [Validators.required, ValidationService.companyIdValidator]]
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
        enrolVersion: '0.1',
        lastSavedDate: '',
        companyId: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, generalInfoModel) {
    generalInfoModel.status = formRecord.controls.formStatus.value;
    generalInfoModel.enrolVersion = formRecord.controls.enrolVersion.value;
    generalInfoModel.lastSavedDate = formRecord.controls.lastSavedDate.value;
    generalInfoModel.companyId = formRecord.controls.companyId.value;
  }

  public static mapDataModelToFormModel(generalInfoModel, formRecord: FormGroup) {
    formRecord.controls.formStatus.setValue(generalInfoModel.status);
    formRecord.controls.enrolVersion.setValue(generalInfoModel.enrolVersion);
    formRecord.controls.lastSavedDate.setValue(generalInfoModel.lastSavedDate);
    formRecord.controls.companyId.setValue(generalInfoModel.companyId);
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
    record.controls.companyId.setValidators([Validators.required, ValidationService.companyIdValidator]);
    record.controls.companyId.updateValueAndValidity();
    return [];
  }


}
