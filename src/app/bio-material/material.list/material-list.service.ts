import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MaterialRecordService} from '../material-record/material-record.service';
import {IMasterDetails} from '../../master-details';

import {MaterialDetailsService} from '../material.details/material.details.service';
import {TranslateService} from '@ngx-translate/core';
import {ListService} from '../../list-service';

@Injectable()
export class MaterialListService extends ListService implements IMasterDetails {

  /***
   *  The data list of material records
   * @type {{id: number; material: string; city: string; country: {id: string; text: string}}[]}
   */
  private materialList = [];
  public countryList = [];
  public speciesFamilyList = [];
  public tissueTypeList = [];
  public derivativeList = [];

  constructor() {
    super();
    this.materialList = [];
    this.initIndex(this.materialList);
  }

  /**
   * Gets the array of  model records
   * @returns {{id: number; material: string; city: string; country: {id: string; text: string}}[]}
   */
  public getModelRecordList() {
    return this.materialList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {

    this.materialList = value;
  }

  /**
   * Adds
   * @param record
   */
  addMaterial(record) {
    // TODO error checking
    this.materialList.push(record);
  }

  getMaterialModel() {

    return MaterialRecordService.getEmptyModel();
  }

  getMaterialFormRecord(fb: FormBuilder) {

    return MaterialRecordService.getReactiveModel(fb);
  }


  public materialFormToData(record: FormGroup, materialModel, countryList) {
    MaterialRecordService.mapFormModelToDataModel(record, materialModel, countryList,
      this.speciesFamilyList, this.tissueTypeList, this.derivativeList);
    return (record);

  }

  public createFormDataList(modelDataList, fb: FormBuilder, theList, countryList) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = MaterialRecordService.getReactiveModel(fb);
      this.materialDataToForm(modelDataList[i], formRecord, countryList);
      theList.push(formRecord);
    }
  }

  public materialDataToForm(materialModel, record: FormGroup, countryList) {
    MaterialRecordService.mapDataModelFormModel(materialModel, record,
      countryList, this.speciesFamilyList, this.tissueTypeList, this.derivativeList);
    return (record);
  }

  public saveRecord(record: FormGroup) {
    if (record.controls.isNew.value) {
      // this.setRecordId(record, this.getNextIndex());
      record.controls.isNew.setValue(false);
      let materialModel = this.getMaterialModel();
      this.materialFormToData(record, materialModel, this.countryList);
      this.materialList.push(materialModel);
      return materialModel.id;
    } else {
      let modelRecord = this.getModelRecord(record.controls.id.value);
      let updatedModel = this.materialFormToData(record, modelRecord, this.countryList);
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
        this.materialList.splice(i, 1);
        if (id === this.getCurrentIndex()) {
          this.setIndex(id - 1);
        }
        return true;
      }
    }
    return false;
  }

  public getRecordId(record: FormGroup) {
    return MaterialDetailsService.getRecordId(record);
  }

  public setRecordId(record: FormGroup, value: number): void {
    MaterialDetailsService.setRecordId(record, value);
  }


}
