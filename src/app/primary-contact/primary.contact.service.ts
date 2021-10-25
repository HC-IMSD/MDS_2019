import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';

@Injectable()
export class PrimaryContactService {

  constructor() {
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

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      renewalContactName: '',
      financeContactName: ''
    });
  }

  /**
   * Gets an empty model
   *
   */
  public static getEmptyModel() {

    return (
      {
        renewal_contact_name: '',
        finance_contact_name: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, primContactModel) {
    primContactModel.renewal_contact_name = formRecord.controls.renewalContactName.value;
    primContactModel.finance_contact_name = formRecord.controls.financeContactName.value;
  }

  public static mapDataModelToFormModel(primContactModel, formRecord: FormGroup) {
    if (primContactModel) {
      formRecord.controls.renewalContactName.setValue(primContactModel.renewal_contact_name);
      formRecord.controls.financeContactName.setValue(primContactModel.finance_contact_name);
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
