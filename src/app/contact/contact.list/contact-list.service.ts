import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CompanyContactRecordService} from '../company-contact-record/company-contact-record.service';
import {IMasterDetails} from '../../master-details';

import {ContactDetailsService} from '../contact.details/contact.details.service';
import {ListService} from '../../list-service';

@Injectable()
export class ContactListService extends ListService implements IMasterDetails {
  /***
   *  The data list of contact records
   * @type {{id: number; contact: string; city: string; country: {id: string; text: string}}[]}
   */
  private contactList = [];

  constructor() {
    super();
    this.contactList = [];
    this.initIndex(this.contactList);
  }

  /**
   * Gets the array of  model records
   * @returns {{id: number; contact: string; city: string; country: {id: string; text: string}}[]}
   */
  public getModelRecordList() {
    return this.contactList;
  }

  /**
   * Sets the data model. Converts the data model to the form model
   * @param value
   */
  public setModelRecordList(value) {

    this.contactList = value;
  }

  /**
   * Adds
   * @param record
   */
  addContact(record) {
    // TODO error checking
    this.contactList.push(record);
  }

  getContactModel() {

    return CompanyContactRecordService.getEmptyModel();
  }

  // getContactFormRecord(fb: FormBuilder, isInternal) {
  //
  //   return CompanyContactRecordService.getReactiveModel(fb, isInternal);
  // }


  public contactFormToData(record: FormGroup, contactModel) {
    CompanyContactRecordService.mapFormModelToDataModel(record, contactModel);
    return (record);

  }

  public createFormDataList(modelDataList, fb: FormBuilder, theList, isInternal) {
    for (let i = 0; i < modelDataList.length; i++) {
      const formRecord = CompanyContactRecordService.getReactiveModel(fb, isInternal);
      this.contactDataToForm(modelDataList[i], formRecord);
      theList.push(formRecord);
    }
  }

  public contactDataToForm(contactModel, record: FormGroup) {
    CompanyContactRecordService.mapDataModelFormModel(contactModel, record);
    return (record);
  }

  public saveRecord(record: FormGroup) {
    if (record.controls.isNew.value) {
      // this.setRecordId(record, this.getNextIndex());
      record.controls.isNew.setValue(false);
      let contactModel = this.getContactModel();
      this.contactFormToData(record, contactModel);
      this.contactList.push(contactModel);
      return contactModel.id;
    } else {
      let modelRecord = this.getModelRecord(record.controls.id.value);
      if (!modelRecord) {
        modelRecord = this.getContactModel();
      }
      const updatedModel = this.contactFormToData(record, modelRecord);
    }
  }

  public getModelRecord(id: number) {
    let modelList = this.getModelRecordList();

    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === Number(id)) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getModelRecordList();
    for (let i = 0; i < modelList.length; i++) {
      if (Number(modelList[i].id) === Number(id)) {
        this.contactList.splice(i, 1);
        if (id === this.getCurrentIndex()) {
          this.setIndex(id - 1);
        }
        return true;
      }
    }
    return false;
  }

  public getRecordId(record: FormGroup) {
    return ContactDetailsService.getRecordId(record);
  }

  public setRecordId(record: FormGroup, value: number): void {
    ContactDetailsService.setRecordId(record, value);
  }


}
