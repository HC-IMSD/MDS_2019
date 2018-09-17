import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectorRef, DoCheck
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
  styleUrls: ['./contact.list.component.css']

})
export class ContactListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit, DoCheck {
  @Input() public contactModel = [];
  @Input() public saveContact;
  @Input() public showErrors: boolean;
  @Input() isInternal: boolean;
  @Output() public errors = new EventEmitter();

  @ViewChild(CompanyContactRecordComponent) companyContactChild: CompanyContactRecordComponent;
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
      label: 'First Name',
      binding: 'firstName',
      width: '25'
    },
    {
      label: 'Last Name',
      binding: 'lastName',
      width: '25'
    },
    {
      label: 'Job Title',
      binding: 'jobTitle',
      width: '25'
    }
  ];

  constructor(private _fb: FormBuilder, private translate: TranslateService) {
    super();
    this.service = new ContactListService();
    this.dataModel = this.service.getModelRecordList();
    this.translate.get('error.msg.required').subscribe(res => {
      console.log(res);
    });
    this.contactListForm = this._fb.group({
      contacts: this._fb.array([])
    });
  }

  ngOnInit() {
    // console.log('this.isInterannnnnl: ' + this.isInternal);
    if (this.isInternal) {
      this.columnDefinitions.concat(
        {
          label: 'Status',
          binding: 'contactStatus',
          width: '25'
        }
      );
    }
  }

  ngAfterViewInit() {
    // this.setExpander(this.expander);
    this.processSummaries(this.errorSummaryChildList);
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

    //   this.cd.detectChanges();
  }


  /***
   * Loads the model data for the contacts into the form Model Used for Testing purposse
   * @private
   */
  /*private _loadContactListData() {
    const modelData3 = [

      {
        'id': 0,
        'company': 'asdaa',
        'contact': 'adasd',
        'provText': '',
        'provList': '',
        'city': 'asdas',
        'country': {
          '__text': 'AIA',
          '_label_en': 'Anguilla',
          '_label_fr': 'Anguilla'
        },
        'postal': ''
      }
    ];
    this.dataModel = modelData3;
    this.service.setModelRecordList(modelData3);
    // console.log(this.countryList);
    this.contactListForm = this._fb.group({
      contacts: this._fb.array([])
    });
    this.service.createFormDataList(modelData3, this.countryList, this._fb, this.contactListForm.controls['contacts']);
    this.validRec = true;
    // this.companyContactChild.contactFormRecord. markAsPristine();
    /!*  const contactDataList = this.service.getModelRecordList();
      const mycontrol = this.getFormContactList();
      const mycontrol = this.getFormContactList();
      // TODO temp setting some initial data
      for (let i = 0; i < contactDataList.length; i++) {
        const formContactRecord = this.service.getContactFormRecord(this._fb);
        this.service.contactDataToForm(contactDataList[i], formContactRecord);
        mycontrol.push(formContactRecord);
      }*!/
    console.log(this.contactListForm);
  }*/

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
    console.log(this.errorSummaryChild);
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
    if (changes['isInternal'] && changes['isInternal'].currentValue) {
      this.columnDefinitions = this.columnDefinitions.concat(
        {
          label: 'Status',
          binding: 'contactStatus',
          width: '25'
        }
      );
    }
    if (changes['saveContact']) {
      this.saveContactRecord(changes['saveContact'].currentValue);
    }
    if (changes['contactModel']) {
      this.service.setModelRecordList(changes['contactModel'].currentValue);
      this.service.initIndex(changes['contactModel'].currentValue);
      this.dataModel = this.service.getModelRecordList();
      // this.contactListForm.controls['contacts'] = this._fb.array([]);
      this.service.createFormDataList(this.dataModel, this._fb, this.contactListForm.controls['contacts']);
      this.validRec = true;
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
      return (this.contactListForm.valid && !this.companyContactChild.contactFormRecord.dirty);
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
  public addContact(): void {

    // add contact to the list
    // console.log('adding an contact');
    // 1. Get the list of reactive form Records
    let contactFormList = <FormArray>this.contactListForm.controls['contacts'];
    console.log(contactFormList);
    // 2. Get a blank Form Model for the new record
    let formContact = CompanyContactRecordService.getReactiveModel(this._fb);
    // 3. set record id
    this.service.setRecordId(formContact, this.service.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formContact, contactFormList);
    console.log(contactFormList);
    // 5. Set the new form to the new contact form reference.
    this.newContactForm = <FormGroup> contactFormList.controls[contactFormList.length - 1];

  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveContactRecord(record: FormGroup) {
    this.saveRecord(record, this.service);
    this.dataModel = this.service.getModelRecordList();
    this.addRecordMsg++;
    this.validRec = true;
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
    for (let err of this.errorList) {
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
    if (this.errorList) {
      emitErrors = this.errorList;
    }
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
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
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteContact(id): void {
    let contactList = this.getFormContactList();
    this.deleteRecord(id, contactList, this.service);
    this.validRec = true;
    this.deleteRecordMsg++;
  }

  /**
   * check if its record exists
   */
  public isDirty(): boolean {
    if (this.companyContactChild && this.companyContactChild.contactFormRecord) {
      return (this.companyContactChild.contactFormRecord.dirty);
    } else {
      return false;
    }
  }


}
