import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class ApplicationInfoService {
  public statusList: Array<any> = [
    {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
    {id: 'AMEND', label_en: 'Amend', label_fr: 'fr_Amend'},
    {id: 'FINAL', label_en: 'Final', label_fr: 'fr_Final'}
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
      status: {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
      enrolVersion: '0.0',
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(5)]]
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {
    return (
      {
        status: {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
        enrolVersion: '0.0',
        lastSavedDate: '',
        companyId: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, applicationInfoModel, statusList) {
    if (formRecord.controls.status.value && formRecord.controls.status.value.length > 0) {
      const status_record = ApplicationInfoService.findRecordByTerm(statusList, formRecord.controls.status.value[0], 'id');
      // this removes the 'text' property that the control needs
      applicationInfoModel.status = {
        '__text': status_record.id,
        '_label_en': status_record.en,
        '_label_fr': status_record.fr
      };
    } else {
      applicationInfoModel.status = {
        '__text': statusList[0].id,
        '_label_en': statusList[0].en,
        '_label_fr': statusList[0].fr
      };
    }
    applicationInfoModel.enrolVersion = formRecord.controls.enrolVersion.value;
    applicationInfoModel.lastSavedDate = formRecord.controls.lastSavedDate.value;
    applicationInfoModel.companyId = formRecord.controls.companyId.value;
  }

  public static mapDataModelToFormModel(applicationInfoModel, formRecord: FormGroup, statusList) {
    const recordIndex = ListService.getRecord(statusList, applicationInfoModel.status.__text, 'id');
    let labelText = '';
    if (recordIndex > -1) {
      labelText = statusList[recordIndex].text;
    }
    if (applicationInfoModel.status) {
      formRecord.controls.status.setValue([
        {
          'id': applicationInfoModel.status.__text,
          'text': labelText
        }
      ]);
    } else {
      formRecord.controls.status.setValue(null);
    }
    formRecord.controls.enrolVersion.setValue(applicationInfoModel.enrolVersion);
    formRecord.controls.lastSavedDate.setValue(applicationInfoModel.lastSavedDate);
    formRecord.controls.companyId.setValue(applicationInfoModel.companyId);
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls.id.value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) {return; }
    record.controls.id.setValue(value);
  }

  public setValidaors(record: FormGroup, eventValue) {
    record.controls.companyId.setValidators([Validators.required, Validators.min(5)]);
    record.controls.companyId.updateValueAndValidity();
    return [];
  }

  /**
   * Find a record by its unique id,. If a dup, returns first instance
   * @param list
   * @param criteria
   * @returns {any}
   */
  public static findRecordByTerm(list, criteria, searchTerm) {

    let result = list.filter(
      item => item[searchTerm] === criteria[searchTerm]);
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

}
