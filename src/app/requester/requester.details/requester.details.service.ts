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
      requesterName: '',
      licenceNum: ''
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        requester_name: '',
        licence_number: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, requesterModel) {
    requesterModel.requester_name = formRecord.controls.requesterName.value;
    requesterModel.licence_number = formRecord.controls.licenceNum.value;
  }

  public static mapDataModelToFormModel(requesterModel, formRecord: FormGroup) {
    formRecord.controls.requesterName.setValue(requesterModel.requester_name);
    formRecord.controls.licenceNum.setValue(requesterModel.licence_number);
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
