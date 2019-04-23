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
      isThirdParty: '',
      repContactCompanyId: [null, [Validators.required, ValidationService.primaryCompanyIdValidator]],
      repContactId: [null, [Validators.required, ValidationService.primaryContactIdValidator]],
      repContactName: [null, Validators.required],
    });
  }

  /**
   * Gets an empty model
   *
   */
  public static getEmptyModel() {

    return (
      {
        is_third_party: '',
        rep_contact_company_id: '',
        rep_contact_id: '',
        rep_contact_name: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, primContactModel) {
    primContactModel.is_third_party = formRecord.controls.isThirdParty.value;
    primContactModel.rep_contact_company_id = formRecord.controls.repContactCompanyId.value;
    primContactModel.rep_contact_id = formRecord.controls.repContactId.value;
    primContactModel.rep_contact_name = formRecord.controls.repContactName.value;
  }

  public static mapDataModelToFormModel(primContactModel, formRecord: FormGroup) {
    formRecord.controls.isThirdParty.setValue(primContactModel.is_third_party);
    formRecord.controls.repContactCompanyId.setValue(primContactModel.rep_contact_company_id);
    formRecord.controls.repContactId.setValue(primContactModel.rep_contact_id);
    formRecord.controls.repContactName.setValue(primContactModel.rep_contact_name);
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
