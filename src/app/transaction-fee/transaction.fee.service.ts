import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class TransactionFeeService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      hasFees: [null, Validators.required],
      billCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      billContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]]
    });
  }

  /**
   * Gets an empty data model
   *
   */
  public getEmptyModel() {

    return (
      {
        has_fees: '',
        billing_company_id: '',
        billing_contact_id: ''
      }
    );
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

  public static mapFormModelToDataModel(formRecord: FormGroup, transFeeModel) {
    transFeeModel.has_fees = formRecord.controls.hasFees.value;
    transFeeModel.billing_company_id = formRecord.controls.billCompanyId.value;
    transFeeModel.billing_contact_id = formRecord.controls.billContactId.value;
  }

  public static mapDataModelToFormModel(transFeeModel, formRecord: FormGroup) {
    formRecord.controls.hasFees.setValue(transFeeModel.has_fees);
    formRecord.controls.billCompanyId.setValue(transFeeModel.billing_company_id);
    formRecord.controls.billContactId.setValue(transFeeModel.billing_contact_id);
  }

}
