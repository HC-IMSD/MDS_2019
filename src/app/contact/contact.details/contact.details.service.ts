import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {TheraClassService} from '../../therapeutic/therapeutic-classification/thera-class.service';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class ContactDetailsService {

  private static lang = GlobalsService.ENGLISH;

  // todo: move statice data to data loader serivce
  public static statusListExternal: Array<any> = [
    {id: 'NEW', label_en: 'New', label_fr: 'fr_New'},
    {id: 'AMEND', label_en: 'Amend', label_fr: 'fr_Amend'},
    {id: 'DELETE', label_en: 'Delete', label_fr: 'fr_Delete'}
  ];
  public static statusListAdd: Array<any> = [
    {id: 'ACTIVE', label_en: 'Active', label_fr: 'fr_Active'}
  ];
  public static statusListInternal: Array<any> = ContactDetailsService.statusListAdd.concat(ContactDetailsService.statusListExternal);

  public static salutationList: Array<any> = [
    {id: 'DR', label_en: 'Dr.', label_fr: 'fr_Dr.'},
    {id: 'MR', label_en: 'Mr.', label_fr: 'fr_Mr.'},
    {id: 'MRS', label_en: 'Mrs.', label_fr: 'fr_Mrs.'},
    {id: 'MS', label_en: 'Ms.', label_fr: 'fr_Ms.'}
  ];
  public static languageList: Array<any> = [
    {'id': 'EN', 'label_en': 'English', 'label_fr': 'Anglais'},
    {'id': 'FR', 'label_en': 'French', 'label_fr': 'Français'}
  ];

  constructor() {
  }

  /**
   * Sets language variable
   *
   */
  public static setLang(lang) {
    ContactDetailsService.lang = lang;
  }

  /**
   * Gets the reactive forms Model for contact details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder, isInternal) {
    if (!fb) {return null; }
    const contactIdValidators = isInternal ? [Validators.required] : [];
    return fb.group({
      contactId: [null, contactIdValidators],
      status: '',
      // hcStatus: [null, Validators.required],
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
        contact_id: '',
        status: '',
        // hc_status: '',
        salutation: '',
        first_name: '',
        initials: '',
        last_name: '',
        language: '',
        job_title: '',
        fax_number: '',
        phone_number: '',
        phone_extension: '',
        email: ''
      }
    );
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, contactModel) {
    contactModel.contact_id = formRecord.controls.contactId.value;
    const status_record = this.findRecordByTerm(
          this._convertListText(this.statusListInternal, this.lang), formRecord.controls.status.value, 'id');
    if (status_record && status_record.id) {
      contactModel.status = {
        '__text': status_record.text,
        '_id': status_record.id,
        '_label_en': status_record.en,
        '_label_fr': status_record.fr
      };
    }
    // contactModel.hc_status = formRecord.controls.hcStatus.value;
    const salutation_record = this.findRecordByTerm(
      this._convertListText(this.salutationList, this.lang), formRecord.controls.salutation.value, 'id');
    if (salutation_record && salutation_record.id) {
      contactModel.status = {
        '__text': salutation_record.text,
        '_id': salutation_record.id,
        '_label_en': salutation_record.en,
        '_label_fr': salutation_record.fr
      };
    }
    contactModel.first_name = formRecord.controls.firstName.value;
    contactModel.initials = formRecord.controls.initials.value;
    contactModel.last_name = formRecord.controls.lastName.value;
    const language_record = this.findRecordByTerm(
      this._convertListText(this.languageList, this.lang), formRecord.controls.language.value, 'id');
    if (language_record && language_record.id) {
      contactModel.status = {
        '__text': language_record.text,
        '_id': language_record.id,
        '_label_en': language_record.en,
        '_label_fr': language_record.fr
      };
    }
    contactModel.job_title = formRecord.controls.jobTitle.value;
    contactModel.fax_number = formRecord.controls.faxNumber.value;
    contactModel.phone_number = formRecord.controls.phoneNumber.value;
    contactModel.phone_extension = formRecord.controls.phoneExtension.value;
    contactModel.email = formRecord.controls.email.value;
  }

  public static mapDataModelToFormModel(contactModel, formRecord: FormGroup) {
    formRecord.controls.contactId.setValue(contactModel.contact_id);
    if (contactModel.status) {
      const status_record = this.findRecordByTerm(this.statusListInternal, contactModel.status._id, 'id');
      if (status_record && status_record.id) {
        formRecord.controls.status.setValue(status_record.id);
      }
    }
    // formRecord.controls.hcStatus.setValue(contactModel.hc_status);
    if (contactModel.salutation) {
      const salutation_record = this.findRecordByTerm(this.statusListInternal, contactModel.salutation._id, 'id');
      if (salutation_record && salutation_record.id) {
        formRecord.controls.salutation.setValue(salutation_record.id);
      }
    }
    formRecord.controls.firstName.setValue(contactModel.first_name);
    formRecord.controls.initials.setValue(contactModel.initials);
    formRecord.controls.lastName.setValue(contactModel.last_name);
    if (contactModel.language) {
      const language_record = this.findRecordByTerm(this.statusListInternal, contactModel.language._id, 'id');
      if (language_record && language_record.id) {
        formRecord.controls.language.setValue(language_record.id);
      }
    }
    formRecord.controls.jobTitle.setValue(contactModel.job_title);
    formRecord.controls.faxNumber.setValue(contactModel.fax_number);
    formRecord.controls.phoneNumber.setValue(contactModel.phone_number);
    formRecord.controls.phoneExtension.setValue(contactModel.phone_extension);
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

  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  private static _convertListText(rawList, lang) {
    const result = [];
    if (lang === GlobalsService.FRENCH) {
      rawList.forEach(item => {
        item.text = item.fr;
        result.push(item);
        //  console.log(item);
      });
    } else {
      rawList.forEach(item => {
        item.text = item.en;
        // console.log("adding country"+item.text);
        result.push(item);
        // console.log(item);
      });
    }
    return result;
  }

}
