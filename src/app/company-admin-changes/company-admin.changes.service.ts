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
        licence: [],
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
    // add licence number and dossier id to all fields
    let aln = '';
    licenceModel.forEach(record => {
      aln += record.licence_number + ', ';
    });
    if (aln.length > 1) {
      adminChangesModel.all_licence_number = aln.substring(0, (aln.length - 2));
    } else {
      adminChangesModel.all_licence_number = '';
    }
    let adi = '';
    licenceModel.forEach(record => {
      adi += record.dossier_id + ', ';
    });
    if (adi.length > 1) {
      adminChangesModel.all_dossier_id = adi.substring(0, (adi.length - 2));
    } else {
      adminChangesModel.all_dossier_id = '';
    }
    adminChangesModel.licence = licenceModel;
    adminChangesModel.is_regulatory_change = formRecord.controls.isReguChange.value;
    if (formRecord.controls.newCompanyId.value) {
      adminChangesModel.new_company_id = 'k' + formRecord.controls.newCompanyId.value;
    }
    adminChangesModel.new_contact_id = formRecord.controls.newContactId.value;
    adminChangesModel.new_contact_name = formRecord.controls.newContactName.value;
  }

  public static mapDataModelToFormModel(adminChangesModel, formRecord: FormGroup) {
    formRecord.controls.isReguChange.setValue(adminChangesModel.is_regulatory_change);
    if (adminChangesModel.new_company_id) {
      formRecord.controls.newCompanyId.setValue(adminChangesModel.new_company_id.slice(1));
    }
    formRecord.controls.newContactId.setValue(adminChangesModel.new_contact_id);
    formRecord.controls.newContactName.setValue(adminChangesModel.new_contact_name);
  }
}
