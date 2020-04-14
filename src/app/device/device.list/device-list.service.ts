import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DeviceRecordService} from '../device-record/device-record.service';
import {IMasterDetails} from '../../master-details';

import {DeviceDetailsService} from '../device.details/device.details.service';
import {ListService} from '../../list-service';

@Injectable()
export class DeviceListService extends ListService implements IMasterDetails {

  /***
   *  The data list of device records
   * @type {{id: number; device: string; country: {id: string; text: string}}[]}
   */
  private deviceList = [];

  constructor() {
    super();
    this.deviceList = [];
    this.initIndex(this.deviceList);
  }

  /**
   * Gets the array of  model records
   * @returns {{id: number; device: string; city: string; country: {id: string; text: string}}[]}
   */
  public getModelRecordList() {
    return this.deviceList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {

    this.deviceList = value;
  }

  /**
   * Adds
   * @param record
   */
  addDevice(record) {
    // TODO error checking
    this.deviceList.push(record);
  }

  getDeviceModel() {

    return DeviceRecordService.getEmptyModel();
  }

  getDeviceFormRecord(fb: FormBuilder) {

    return DeviceRecordService.getReactiveModel(fb);
  }


  public deviceFormToData(record: FormGroup, deviceModel) {
    DeviceRecordService.mapFormModelToDataModel(record, deviceModel);
    return (record);

  }

  public createFormDataList(modelDataList, fb: FormBuilder, theList) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = DeviceRecordService.getReactiveModel(fb);
      this.deviceDataToForm(modelDataList[i], formRecord);
      theList.push(formRecord);
    }
  }

  public deviceDataToForm(deviceModel, record: FormGroup) {
    DeviceRecordService.mapDataModelFormModel(deviceModel, record);
    return (record);
  }

  public saveRecord(record: FormGroup) {
    if (record.controls.isNew.value) {
      // this.setRecordId(record, this.getNextIndex());
      record.controls.isNew.setValue(false);
      let deviceModel = this.getDeviceModel();
      this.deviceFormToData(record, deviceModel);
      this.deviceList.push(deviceModel);
      return deviceModel.id;
    } else {
      let modelRecord = this.getModelRecord(record.controls.id.value);
      let updatedModel = this.deviceFormToData(record, modelRecord);
    }
  }

  public getModelRecord(id: number) {
    let modelList = this.getModelRecordList();

    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === id) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getModelRecordList();
    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === id) {
        this.deviceList.splice(i, 1);
        if (id === this.getCurrentIndex()) {
          this.setIndex(id - 1);
        }
        return true;
      }
    }
    return false;
  }

  public getRecordId(record: FormGroup) {
    return DeviceDetailsService.getRecordId(record);
  }

  public setRecordId(record: FormGroup, value: number): void {
    DeviceDetailsService.setRecordId(record, value);
  }


}
