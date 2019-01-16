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
      enrolVersion: '0.0',
      lastSavedDate: '',
      companyId: ['', [Validators.required, ValidationService.companyIdValidator]],
      amendReason: [null, Validators.required],
      nameChange: [false, []],
      addressChange: [false, []],
      facilityChange: [false, []],
      otherChange: [false, []],
      otherDetails: '',
      areLicensesTransfered: ['', [Validators.required]]
    });
  }

  public static getAmendReasons() {
    return ['manuname', 'manuaddr', 'facility', 'other'];
  }

  /**
   * Gets an yesno array
   *
   */
  public static getYesNoList() {
    return [
      GlobalsService.YES,
      GlobalsService.NO
    ];
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

  public static mapFormModelToDataModel(formRecord: FormGroup, generalInfoModel) {
    generalInfoModel.status = formRecord.controls.formStatus.value;
    generalInfoModel.enrol_version = formRecord.controls.enrolVersion.value;
    generalInfoModel.last_saved_date = formRecord.controls.lastSavedDate.value;
    generalInfoModel.company_id = formRecord.controls.companyId.value;
    generalInfoModel.amend_reasons.manufacturer_name_change = formRecord.controls.nameChange.value ? GlobalsService.YES : GlobalsService.NO;
    generalInfoModel.amend_reasons.manufacturer_address_change =
      formRecord.controls.addressChange.value ? GlobalsService.YES : GlobalsService.NO;
    generalInfoModel.amend_reasons.facility_change = formRecord.controls.facilityChange.value ? GlobalsService.YES : GlobalsService.NO;
    generalInfoModel.amend_reasons.other_change = formRecord.controls.otherChange.value ? GlobalsService.YES : GlobalsService.NO;
    generalInfoModel.amend_reasons.other_details = formRecord.controls.otherDetails.value;
    generalInfoModel.are_licenses_transfered = formRecord.controls.areLicensesTransfered.value;
  }

  public static mapDataModelToFormModel(generalInfoModel, formRecord: FormGroup) {
    formRecord.controls.formStatus.setValue(generalInfoModel.status);
    formRecord.controls.enrolVersion.setValue(generalInfoModel.enrol_version);
    formRecord.controls.lastSavedDate.setValue(generalInfoModel.last_saved_date);
    formRecord.controls.companyId.setValue(generalInfoModel.company_id);
    const namec = generalInfoModel.amend_reasons.manufacturer_name_change === GlobalsService.YES ? true : false;
    formRecord.controls.nameChange.setValue(namec);
    const addc = generalInfoModel.amend_reasons.manufacturer_address_change === GlobalsService.YES ? true : false;
    formRecord.controls.addressChange.setValue(addc);
    const facc = generalInfoModel.amend_reasons.facility_change === GlobalsService.YES ? true : false;
    formRecord.controls.facilityChange.setValue(facc);
    const othc = generalInfoModel.amend_reasons.other_change === GlobalsService.YES ? true : false;
    formRecord.controls.amendReason.setValue((namec || addc || facc || othc) ? 'reasonFilled' : null);
    formRecord.controls.amendReason.setValue(othc);
    formRecord.controls.otherDetails.setValue(generalInfoModel.amend_reasons.other_details);
    formRecord.controls.areLicensesTransfered.setValue(generalInfoModel.are_licenses_transfered);
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
