import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {LicenceRecordService} from '../licence-record/licence-record.service';
import {IMasterDetails} from '../../master-details';

import {LicenceDetailsService} from '../licence.details/licence.details.service';
import {ListService} from '../../list-service';

@Injectable()
export class LicenceListService extends ListService implements IMasterDetails {

  /***
   *  The data list of licence records
   * @type {id: number; licence_number: string; dossier_number: string}
   */
  private licenceList = [];

  constructor() {
    super();
    this.licenceList = [];
    this.initIndex(this.licenceList);
  }

  /**
   * Gets the array of  model records
   * @returns {id: number; licence_number: string; dossier_number: string}
   */
  public getModelRecordList() {
    return this.licenceList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {

    this.licenceList = value;
  }

  /**
   * Adds
   * @param record
   */
  addLicence(record) {
    // TODO error checking
    this.licenceList.push(record);
  }

  getLicenceModel() {

    return LicenceRecordService.getEmptyModel();
  }

  getLicenceFormRecord(fb: FormBuilder, isInternal) {

    return LicenceRecordService.getReactiveModel(fb, isInternal);
  }


  public licenceFormToData(record: FormGroup, licenceModel) {
    LicenceRecordService.mapFormModelToDataModel(record, licenceModel);
    return (record);

  }

  public createFormDataList(modelDataList, fb: FormBuilder, theList, isInternal) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = LicenceRecordService.getReactiveModel(fb, isInternal);
      this.licenceDataToForm(modelDataList[i], formRecord);
      theList.push(formRecord);
    }
  }

  public licenceDataToForm(licenceModel, record: FormGroup) {
    LicenceRecordService.mapDataModelFormModel(licenceModel, record);
    return (record);
  }

  public saveRecord(record: FormGroup) {
    if (record.controls.isNew.value) {
      // this.setRecordId(record, this.getNextIndex());
      record.controls.isNew.setValue(false);
      let licenceModel = this.getLicenceModel();
      this.licenceFormToData(record, licenceModel);
      this.licenceList.push(licenceModel);
      return licenceModel.id;
    } else {
      let modelRecord = this.getModelRecord(record.controls.id.value);
      let updatedModel = this.licenceFormToData(record, modelRecord);
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
        this.licenceList.splice(i, 1);
        if (id === this.getCurrentIndex()) {
          this.setIndex(id - 1);
        }
        return true;
      }
    }
    return false;
  }

  public getRecordId(record: FormGroup) {
    return LicenceDetailsService.getRecordId(record);
  }

  public setRecordId(record: FormGroup, value: number): void {
    LicenceDetailsService.setRecordId(record, value);
  }


}
