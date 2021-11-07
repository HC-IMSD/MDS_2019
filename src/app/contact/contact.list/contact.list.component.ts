import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, DoCheck, ViewEncapsulation
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {CompanyContactRecordComponent} from '../company-contact-record/company-contact-record.component';
import {CompanyContactRecordService} from '../company-contact-record/company-contact-record.service';
import {ContactListService} from './contact-list.service';
import {ListOperations} from '../../list-operations';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../../globals/globals.service';

//  import {ExpanderComponent} from '../../common/expander/expander.component';
@Component({
  selector: 'contact-list',
  templateUrl: './contact.list.component.html',
  styleUrls: ['./contact.list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ContactListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit, DoCheck {
  @Input() public contactModel = [];
  @Input() public saveContact;
  @Input() public showErrors: boolean;
  @Input() public loadFileIndicator;
  @Input() public isInternal: boolean;
  @Input() public xmlStatus;
  @Input() lang;
  @Input() helpTextSequences;
  @Output() public errors = new EventEmitter();
  @Output() public contactsUpdated = new EventEmitter();

  @ViewChild(CompanyContactRecordComponent, {static: true}) companyContactChild: CompanyContactRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  // private prevRow = -1;
  public updateContactDetails = 0;
  public contactListForm: FormGroup;
  public newContactForm: FormGroup;
  public service: ContactListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public dataModel = [];
  public validRec = true;
  public columnDefinitions = [
    {
      label: 'Contact Identifier',
      binding: 'contact_id',
      width: '10'
    },
    {
      label: 'Full Name (First and Last)',
      binding: 'full_name',
      width: '40'
    },
    // {
    //   label: 'Last Name',
    //   binding: 'last_name',
    //   width: '20'
    // },
    {
      label: 'Job Title',
      binding: 'job_title',
      width: '20'
    },
    {
      label: 'Status',
      binding: 'status_text',
      width: '15'
    }
  ];

  constructor(private _fb: FormBuilder, private translate: TranslateService) {
    super();
    this.service = new ContactListService();
    this.dataModel = this.service.getModelRecordList();
    this.translate.get('error.msg.required').subscribe(res => {
      // console.log(res);
    });
    this.contactListForm = this._fb.group({
      contacts: this._fb.array([])
    });
  }

  ngOnInit() {
    // console.log('this.isInterannnnnl: ' + this.isInternal);
  }

  ngAfterViewInit() {
    // this.setExpander(this.expander);
    this.processSummaries(this.errorSummaryChildList);
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

    //   this.cd.detectChanges();
  }

  /**
   * Updates the error list to include the error summaries. Messages upwards
   * @param {QueryList<ErrorSummaryComponent>} list
   */
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    // console.log('ContactList process Summaries');
    this.errorSummaryChild = list.first;
    // TODO what is this for need to untangle
    this.setErrorSummary(this.errorSummaryChild);
    if (this.errorSummaryChild) {
      this.errorSummaryChild.index = this.getExpandedRow();
    }
    // console.log(this.errorSummaryChild);
    this._emitErrors();
  }


  ngDoCheck() {
    this.isValid();
    this._syncCurrentExpandedRow();
  }

  /**
   *
   * @private syncs the contact details record with the reactive model. Uses view child functionality
   */
  private _syncCurrentExpandedRow(): void {
    if (this.companyContactChild) {
      const contactFormList = this.getFormContactList();
      const result = this.syncCurrentExpandedRow(contactFormList);
      // Onlu update the results if there is a change. Otherwise the record will not be dirty

      if (result) {
        this.companyContactChild.contactFormRecord = result;
        this.updateContactDetails++;
      }
    } else {
      console.warn('There is no company contact child');
    }
  }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['loadFileIndicator'] && !changes['loadFileIndicator'].firstChange) {
      this.newRecordIndicator = false;
      this._deleteContactInternal(0);
    }
    if (changes['saveContact']) {
      this.saveContactRecord(changes['saveContact'].currentValue);
    }
    if (changes['contactModel']) {
      this.service.setModelRecordList(changes['contactModel'].currentValue);
      this.service.initIndex(changes['contactModel'].currentValue);
      this.dataModel = this.service.getModelRecordList();
      // this.contactListForm.controls['contacts'] = this._fb.array([]);
      this.service.createFormDataList(this.dataModel, this._fb, this.contactListForm.controls['contacts'], this.isInternal);
      this.validRec = true;
    }

    if (changes['isInternal']) {
      if (!this.isInternal && (!this.contactModel || this.contactModel.length === 0)) {
        this.addContactInit();
        this.showErrors = false;
      }
    }
  }

  public isValid(override: boolean = false): boolean {
    if (override) {
      return true;
    }
    if (this.newRecordIndicator) {
      this.validRec = false;
      return false;
    } else if (this.companyContactChild && this.companyContactChild.contactFormRecord) {
      this.validRec = this.contactListForm.valid && !this.companyContactChild.contactFormRecord.dirty;
      return true; //(this.contactListForm.valid && !this.companyContactChild.contactFormRecord.dirty);
    }
    this.validRec = this.contactListForm.valid;
    return (this.contactListForm.valid);
  }

  public getFormContactList(): FormArray {
    return <FormArray>(this.contactListForm.controls['contacts']);
  }

  /**
   * returns an contact record with a given id
   * @param {number} id - the identifier for that contact record
   * @returns {FormGroup} -the contact record, null if theere is no match
   * @private
   */
  private _getFormContact(id: number): FormGroup {
    let contactList = this.getFormContactList();
    return this.getRecord(id, contactList);
  }

  /**
   * Adds an contact UI record to the contact List
   */
  public addContactInit(): void {

    // add contact to the list
    // console.log('adding an contact');
    // 1. Get the list of reactive form Records
    let contactFormList = <FormArray>this.contactListForm.controls['contacts'];
    // console.log(contactFormList);
    // 2. Get a blank Form Model for the new record
    let formContact = CompanyContactRecordService.getReactiveModel(this._fb, this.isInternal);
    // 3. set record id
    this.service.setRecordId(formContact, this.service.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formContact, contactFormList);
    // console.log(contactFormList);
    // 5. Set the new form to the new contact form reference.
    this.newContactForm = <FormGroup> contactFormList.controls[contactFormList.length - 1];
  }

  /**
   * Adds an contact UI record to the contact List
   */
  public addContact(): void {

    // add contact to the list
    // console.log('adding an contact');
    // 1. Get the list of reactive form Records
    let contactFormList = <FormArray>this.contactListForm.controls['contacts'];
    // console.log(contactFormList);
    // 2. Get a blank Form Model for the new record
    let formContact = CompanyContactRecordService.getReactiveModel(this._fb, this.isInternal);
    // 3. set record id
    this.service.setRecordId(formContact, this.service.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formContact, contactFormList);
    // console.log(contactFormList);
    // 5. Set the new form to the new contact form reference.
    this.newContactForm = <FormGroup> contactFormList.controls[contactFormList.length - 1];
    if (this.isInternal) {
      document.location.href = '#contactId';
    } else {
      document.location.href = '#status';
    }
    this.showErrors = false;
  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveContactRecord(record: FormGroup) {
    this.saveRecord(record, this.service);
    this.dataModel = this.service.getModelRecordList();
    this.addRecordMsg++;
    this.showErrors = true;
    if (!this.isInternal) {
      document.location.href = '#addContactBtn';
    }
    this.contactsUpdated.emit(this.dataModel);
  }

  /**
   * Sets the contact details controls form to a given row (not an id)
   * @param row
   */
  // public getRow(row): void {
  //   if (row > -1) {
  //     let mycontrol = this.getFormContactList();
  //     this.companyContactChild.contactFormRecord = <FormGroup> mycontrol.controls[row];
  //     this.updateContactDetails++;
  //   } else {
  //     console.info('Contact List row number is ' + row);
  //   }
  // }

  /**
   *  Updates the error list
   * @param errs - the list of errors to broadcast
   */
  updateErrorList(errs) {
    this.errorList = errs;
    // this.errorList = (errs && errs.length > 0) ? this.errorList.concat(errs) : [];
    for (const err of this.errorList) {
      err.index = this.getExpandedRow();
      if (err.type === GlobalsService.errorSummClassName) {
        err.expander = this.expander; // associate the expander
      }
    }
    this._emitErrors(); // needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    // adding the child errors
    if (this.errorList) { //  && !this.isInternal
      // emitErrors = this.errorList;
      this.errorList.forEach((error: any) => {
        emitErrors.push(error);
      });
    }
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    if (!this.isInternal && this._noNonRemoveRecords(this.dataModel)) { // && this.errorList.length === 0
      const oerr = new ErrorSummaryComponent(null);
      oerr.index = 0;
      oerr.tableId = 'contactListTable';
      oerr.type = 'leastOneRecordError';
      emitErrors.push(oerr);
    }
    this.errors.emit(emitErrors);
  }

  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertContact(record): void {
    let recordId = record.controls.id.value;

    let modelRecord = this.service.getModelRecord(recordId);
    if (!modelRecord) {
      modelRecord = this.service.getContactModel();
      modelRecord.id = recordId;
    }
    let rec = this._getFormContact(recordId);
    if (rec) {
      CompanyContactRecordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      // should never happen, there should always be a UI record
      console.warn('ContactList:rec is null');
    }
    if (this.isInternal) {
      document.location.href = '#contactId';
    } else {
      document.location.href = '#status';
    }
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  private _deleteContactInternal(id): void {
    const contactList = this.getFormContactList();
    this.deleteRecord(id, contactList, this.service);
    this.validRec = true;
    this.deleteRecordMsg++;
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteContact(id): void {
    this._deleteContactInternal(id);
    document.location.href = '#addContactBtn';
    this.contactsUpdated.emit(this.dataModel);
  }

  /**
   * check if its record exists
   */
  public isDirty(): boolean {
    return (!(this.contactListForm.valid  || !this.contactListForm.errors) ||
      this.contactListForm.dirty || this.newRecordIndicator);
  }

  /**
   * Changes the local model back to the last saved version of the requester
   */
  public showErrorsSummary(): boolean {
    return (this.showErrors && this.errorList.length > 0);
  }

  /**
   * check if there is any record in dataList whose status is not remove
   * @param id
   */
  private _noNonRemoveRecords(dataList): boolean {
    if (dataList && dataList.length > 0) {
      for (const index in dataList) {
        if (dataList[index].status._id !== 'REMOVE') {return false; }
      }
      // dataList.forEach(record => {
      //   if (record.status._id !== 'Remove') {return false; }
      // });
    }

    return true;
  }
}
