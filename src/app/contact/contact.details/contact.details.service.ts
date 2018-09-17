import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class ContactDetailsService {

  public statusListExternal: Array<any> = [
    {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
    {id: 'AMEND', label_en: 'Amend', label_fr: 'fr_Amend'},
    {id: 'DELETE', label_en: 'Delete', label_fr: 'fr_Delete'}
  ];
  public statusListAdd: Array<any> = [
    {id: 'ACTIVE', label_en: 'Active', label_fr: 'fr_Active'},
    {id: 'INACTIVE', label_en: 'Inactive', label_fr: 'fr_Inactive'}
  ];
  public statusListInternal: Array<any> = this.statusListExternal.concat(this.statusListAdd);

  public salutationList: Array<any> = [
    {id: 'DR', label_en: 'Dr.', label_fr: 'fr_Dr.'},
    {id: 'MR', label_en: 'Mr.', label_fr: 'fr_Mr.'},
    {id: 'MRS', label_en: 'Mrs.', label_fr: 'fr_Mrs.'},
    {id: 'MS', label_en: 'Ms.', label_fr: 'fr_Ms.'}
  ];
  public languageList: Array<any> = [
    {'id': 'EN', 'label_en': 'English', 'label_fr': 'Anglais'},
    {'id': 'FR', 'label_en': 'French', 'label_fr': 'Français'}
  ];

  constructor() {
  }

  /**
   * Gets the reactive forms Model for contact details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      contactId: '',
      status: '',
      salutation: [null, Validators.required],
      firstName: [null, Validators.required],
      initials: '',
      lastName: [null, Validators.required],
      language: '',
      jobTitle: [null, Validators.required],
      faxNumber: ['', [Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), ValidationService.phoneNumberValidator]],
      phoneExtension: '',
      email: [null, [Validators.required, ValidationService.emailValidator]]
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        contactId: '',
        status: '',
        salutation: '',
        firstName: '',
        initials: '',
        lastName: '',
        language: '',
        jobTitle: '',
        faxNumber: '',
        phoneNumber: '',
        phoneExtension: '',
        email: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, contactModel) {
    contactModel.contactId = formRecord.controls.contactId.value;
    contactModel.status = formRecord.controls.status.value;
    contactModel.salutation = formRecord.controls.salutation.value;
    contactModel.firstName = formRecord.controls.firstName.value;
    contactModel.initials = formRecord.controls.initials.value;
    contactModel.lastName = formRecord.controls.lastName.value;
    contactModel.language = formRecord.controls.language.value;
    contactModel.jobTitle = formRecord.controls.jobTitle.value;
    contactModel.faxNumber = formRecord.controls.faxNumber.value;
    contactModel.phoneNumber = formRecord.controls.phoneNumber.value;
    contactModel.phoneExtension = formRecord.controls.phoneExtension.value;
    contactModel.email = formRecord.controls.email.value;
  }

  public static mapDataModelToFormModel(contactModel, formRecord: FormGroup) {
    formRecord.controls.contactId.setValue(contactModel.contactId);
    formRecord.controls.status.setValue(contactModel.status);
    formRecord.controls.salutation.setValue(contactModel.salutation);
    formRecord.controls.firstName.setValue(contactModel.firstName);
    formRecord.controls.initials.setValue(contactModel.initials);
    formRecord.controls.lastName.setValue(contactModel.lastName);
    formRecord.controls.language.setValue(contactModel.language);
    formRecord.controls.jobTitle.setValue(contactModel.jobTitle);
    formRecord.controls.faxNumber.setValue(contactModel.faxNumber);
    formRecord.controls.phoneNumber.setValue(contactModel.phoneNumber);
    formRecord.controls.phoneExtension.setValue(contactModel.phoneExtension);
    formRecord.controls.email.setValue(contactModel.email);
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
