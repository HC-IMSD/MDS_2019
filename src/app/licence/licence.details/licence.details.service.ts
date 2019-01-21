import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class LicenceDetailsService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for licence details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder, isInternal) {
    if (!fb) {
      return null;
    } else if (isInternal) {
      return fb.group({
        licenceNum: ['', [Validators.required, ValidationService.licenceNumValidator]],
        dossierId: ['', [Validators.required]]
      });
    } else {
      return fb.group({
        licenceNum: ['', [Validators.required, ValidationService.licenceNumValidator]],
        dossierId: ''
      });
    }
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        licence_number: '',
        dossier_id: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, licenceModel) {
    licenceModel.licence_number = formRecord.controls.licenceNum.value;
    licenceModel.dossier_id = formRecord.controls.dossierId.value;
  }

  public static mapDataModelToFormModel(licenceModel, formRecord: FormGroup) {
    formRecord.controls.licenceNum.setValue(licenceModel.licence_number);
    formRecord.controls.dossierId.setValue(licenceModel.dossier_id);
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
