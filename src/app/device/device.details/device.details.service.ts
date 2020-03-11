import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class DeviceDetailsService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for device details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      deviceName: '',
      deviceAuthorized: '',
      licenceNum: '',
      deviceApplicationSubmitted: '',
      //deviceApplicationNumber: [null, [Validators.required, ValidationService.appNumValidator ]],
      deviceApplicationNumber: '',
      deviceExplain: ''
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        device_name: '',
        device_Authorized: '',
        licence_number: '',
        device_application_submitted: '',
        device_application_number: '',
        device_explain: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, deviceModel) {
    deviceModel.device_name = formRecord.controls.deviceName.value;
    deviceModel.device_Authorized = formRecord.controls.deviceAuthorized.value;
    deviceModel.licence_number = formRecord.controls.licenceNum.value;
    deviceModel.device_application_submitted = formRecord.controls.deviceApplicationSubmitted.value;
    deviceModel.device_application_number = formRecord.controls.deviceApplicationNumber.value;
    deviceModel.device_explain = formRecord.controls.deviceExplain.value;
  }

  public static mapDataModelToFormModel(deviceModel, formRecord: FormGroup) {
    formRecord.controls.deviceName.setValue(deviceModel.device_name);
    formRecord.controls.deviceAuthorized.setValue(deviceModel.device_Authorized);
    formRecord.controls.licenceNum.setValue(deviceModel.licence_number);
    formRecord.controls.deviceApplicationSubmitted.setValue(deviceModel.device_application_submitted);
    formRecord.controls.deviceApplicationNumber.setValue(deviceModel.device_application_number);
    formRecord.controls.deviceExplain.setValue(deviceModel.device_explain);
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls.id.value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) {
      return;
    }
    record.controls.id.setValue(value);
  }


  /**
   * Gets an yesno array
   *
   */
  public getYesNoList() {
    return [
      GlobalsService.YES,
      GlobalsService.NO
    ];
  }
}
