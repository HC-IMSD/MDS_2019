import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {RequesterRecordService} from '../requester-record/requester-record.service';
import {IMasterDetails} from '../../master-details';

import {RequesterDetailsService} from '../requester.details/requester.details.service';
import {ListService} from '../../list-service';

@Injectable()
export class RequesterListService extends ListService implements IMasterDetails {

  /***
   *  The data list of requester records
   * @type {{id: number; requester: string; country: {id: string; text: string}}[]}
   */
  private requesterList = [];

  constructor() {
    super();
    this.requesterList = [];
    this.initIndex(this.requesterList);
  }

  /**
   * Gets the array of  model records
   * @returns {{id: number; requester: string; city: string; country: {id: string; text: string}}[]}
   */
  public getModelRecordList() {
    return this.requesterList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {

    this.requesterList = value;
  }

  /**
   * Adds
   * @param record
   */
  addRequester(record) {
    // TODO error checking
    this.requesterList.push(record);
  }

  getRequesterModel() {

    return RequesterRecordService.getEmptyModel();
  }

  getRequesterFormRecord(fb: FormBuilder) {

    return RequesterRecordService.getReactiveModel(fb);
  }


  public requesterFormToData(record: FormGroup, requesterModel) {
    RequesterRecordService.mapFormModelToDataModel(record, requesterModel);
    return (record);

  }

  public createFormDataList(modelDataList, fb: FormBuilder, theList) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = RequesterRecordService.getReactiveModel(fb);
      this.requesterDataToForm(modelDataList[i], formRecord);
      theList.push(formRecord);
    }
  }

  public requesterDataToForm(requesterModel, record: FormGroup) {
    RequesterRecordService.mapDataModelFormModel(requesterModel, record);
    return (record);
  }

  public saveRecord(record: FormGroup) {
    if (record.controls.isNew.value) {
      // this.setRecordId(record, this.getNextIndex());
      record.controls.isNew.setValue(false);
      let requesterModel = this.getRequesterModel();
      this.requesterFormToData(record, requesterModel);
      this.requesterList.push(requesterModel);
      return requesterModel.id;
    } else {
      let modelRecord = this.getModelRecord(record.controls.id.value);
      let updatedModel = this.requesterFormToData(record, modelRecord);
    }
  }

  public getModelRecord(id: number) {
    let modelList = this.getModelRecordList();

    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getModelRecordList();
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        this.requesterList.splice(i, 1);
        if (id === this.getCurrentIndex()) {
          this.setIndex(id - 1);
        }
        return true;
      }
    }
    return false;
  }

  public getRecordId(record: FormGroup) {
    return RequesterDetailsService.getRecordId(record);
  }

  public setRecordId(record: FormGroup, value: number): void {
    RequesterDetailsService.setRecordId(record, value);
  }


}
