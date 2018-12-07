import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class RequesterDetailsService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for requester details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      requester: ''
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        requester: '',
        requester_text: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, requesterModel, requesterList) {
    if (formRecord.controls.requester.value && formRecord.controls.requester.value.length > 0) {
      requesterModel.requester_text = formRecord.controls.requester.value[0].text;
      const requester_record = RequesterDetailsService.findRecordByTerm(requesterList, formRecord.controls.requester.value[0], 'id');
      // this removes the 'text' property that the control needs
      if (requester_record && requester_record.id) {
        requesterModel.requester = {
          '__text': requester_record.id,
          '_label_en': requester_record.en,
          '_label_fr': requester_record.fr
        };
      } else {
        requesterModel.requester = formRecord.controls.requester.value[0]; // todo: need to debug to set proper format ???
      }
    } else {
      requesterModel.requester = null;
    }
  }

  public static mapDataModelToFormModel(requesterModel, formRecord: FormGroup, requesterList) {
    const recordIndex = ListService.getRecord(requesterList, requesterModel.requester.__text, 'id');
    let labelText = '';
    if (recordIndex > -1) {
      labelText = requesterList[recordIndex].text;
      if (requesterModel.requester) {
        formRecord.controls.requester.setValue([
          {
            'id': requesterModel.requester.__text,
            'text': labelText
          }
        ]);
      } else {
        formRecord.controls.requester.setValue(null);
      }
    } else {
      formRecord.controls.requester.setValue([
          {
            'id': requesterModel.requester.__text,
            'text': requesterModel.requester.__text
          }
      ]);
    }
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
