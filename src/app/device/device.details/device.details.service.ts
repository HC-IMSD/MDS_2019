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
      licenceNum: [null, [Validators.required, ValidationService.licenceNumValidator ]]
     // licenceNum: [null, [ValidationService.licenceNumValidator]]
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
        licence_number: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, deviceModel) {
    deviceModel.device_name = formRecord.controls.deviceName.value;
    deviceModel.licence_number = formRecord.controls.licenceNum.value;
  }

  public static mapDataModelToFormModel(deviceModel, formRecord: FormGroup) {
    formRecord.controls.deviceName.setValue(deviceModel.device_name);
    formRecord.controls.licenceNum.setValue(deviceModel.licence_number);
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

}
