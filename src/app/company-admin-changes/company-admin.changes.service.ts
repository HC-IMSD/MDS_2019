import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class CompanyAdminChangesService {

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
      isReguChange: [null, Validators.required],
      newCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      newContactId: ['', []],
      newContactName: [null, Validators.required]
    });
  }

  /**
   * Gets an empty data model
   *
   */
  public getEmptyModel() {

    return (
      {
        all_licence_number: '',
        all_dossier_id: '',
        is_regulatory_change: '',
        new_company_id: '',
        new_contact_id: '',
        new_contact_name: ''
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

  public static mapFormModelToDataModel(formRecord: FormGroup, adminChangesModel, licenceModel) {
    adminChangesModel.all_licence_number = licenceModel.all_licence_number;
    adminChangesModel.all_dossier_id = licenceModel.all_dossier_id;
    adminChangesModel.is_regulatory_change = formRecord.controls.isReguChange.value;
    adminChangesModel.new_company_id = formRecord.controls.newCompanyId.value;
    adminChangesModel.new_contact_id = formRecord.controls.newContactId.value;
    adminChangesModel.new_contact_name = formRecord.controls.newContactName.value;
  }

  public static mapDataModelToFormModel(adminChangesModel, formRecord: FormGroup, licenceModel) {
    licenceModel.all_licence_number = adminChangesModel.all_licence_number;
    licenceModel.all_dossier_id = adminChangesModel.all_dossier_id;
    formRecord.controls.isReguChange.setValue(adminChangesModel.is_regulatory_change);
    formRecord.controls.newCompanyId.setValue(adminChangesModel.new_company_id);
    formRecord.controls.newContactId.setValue(adminChangesModel.new_contact_id);
    formRecord.controls.newContactName.setValue(adminChangesModel.new_contact_name);
  }

}
