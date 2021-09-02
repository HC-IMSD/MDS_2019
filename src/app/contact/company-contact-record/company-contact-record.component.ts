import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ContactDetailsComponent} from '../contact.details/contact.details.component';
import {ContactDetailsService} from '../contact.details/contact.details.service';
import {CompanyContactRecordService} from './company-contact-record.service';
import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';


@Component({
  selector: 'company-contact-record',
  templateUrl: './company-contact-record.component.html',
  styleUrls: ['./company-contact-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class CompanyContactRecordComponent implements OnInit, AfterViewInit {

  public contactRecordModel: FormGroup;
  @Input('group') public contactFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() countries: Array<any>;
  @Input() isInternal: boolean;
  @Input() newRecord: boolean;
  @Input() showErrors: boolean;
  @Input() hasRecords: boolean;
  @Input() isListVilad: boolean;
  @Input() lang;
  @Input() helpTextSequences;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();
  @Output() createRecord; // TODO don't know if needed


  @ViewChild(ContactDetailsComponent, {static: true}) contactDetailsChild;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  public isNew: boolean;
  public showErrSummary: boolean;
  public errorSummaryChild: ErrorSummaryComponent = null;
  public headingLevel = 'h4';

  constructor(private _fb: FormBuilder,  private cdr: ChangeDetectorRef) {
    this.showErrors = false;
    this.showErrSummary = false;
    this.hasRecords = true;
  }

  ngOnInit() {
    if (!this.contactRecordModel) {
      this.contactRecordModel = this._initContact();
    }
    this.detailsChanged = 0;
  }
  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Contact record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

  }
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Contact List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    // if (!this.isInternal && this.errorSummaryChild && !this.hasRecords) {
    //   // update summary for at least one record error
    //   this.errorSummaryChild.tableId = 'contactListTable';
    //   this.errorSummaryChild.type = 'leastOneRecordError';
    // }
    // set table id to point to
    this._emitErrors();
  }
  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    this.errors.emit(emitErrors);
  }


  private _initContact() {
    if (this.isNew) {
      return CompanyContactRecordService.getReactiveModel(this._fb, this.isInternal);
    }
  }

  ngOnChanges (changes: SimpleChanges) {

    if (changes['detailsChanged']) { // used as a change indicator for the model
      if (this.contactFormRecord) {
        this.setToLocalModel();
      } else {
        this.contactRecordModel = this._initContact();
        if (this.contactRecordModel) {
          this.contactRecordModel.markAsPristine();
        }
      }
      this.updateChild++;
    }
    if (changes['newRecord']) {
      this.isNew = changes['newRecord'].currentValue;
    }
    // if (this.isInternal) {
      if (changes['showErrors']) {
        this.showErrSummary = changes['showErrors'].currentValue;
        this._emitErrors();
      }
      this.cdr.detectChanges(); // doing our own change detection
    // }
  }

  /***
   *Sets the contact record to the internal model
   */
  setToLocalModel() {
    this.contactRecordModel = this.contactFormRecord;
    this.sequenceNum = Number(this.contactRecordModel.controls.id.value) + 1;
    this.contactRecordModel.markAsPristine();
  }

  /**
   * Updates the master error list. Combines the record level field errors with the child record field error
   * @param errs
   * @param {boolean} isParent
   */
  updateErrorList(errs, isParent: boolean = false) {
    // console.log("Starting update error list")
    if (!isParent) {
      this.childErrorList = errs;
    }
    this.parentErrorList = [];
    // do this so don't miss it on a race condition
    if (this.msgList) {
      this.msgList.forEach(
        error => {
          this.parentErrorList.push(error);
        }
      );
      // this.cdr.detectChanges(); // doing our own change detection
    }

    this.errorList = new Array();
    this.errorList = this.parentErrorList.concat(this.childErrorList);
    // console.log(this.errorList);

    this.cdr.detectChanges(); // doing our own change detection
  }

  /**
   * Changes the local model back to the last saved version of the contact
   */
  public revertContactRecord(): void {
    this.revertRecord.emit(this.contactRecordModel);
    this.contactRecordModel.markAsPristine();
  }

  /***
   * Deletes the contact reocord with the selected id from both the model and the form
   */
  public deleteContactRecord(): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(this.contactRecordModel.value.id);
    this._emitErrors();
  }
  /***
   * Deletes the contact reocord with the selected id from both the model and the form
   */
  public setStatusToRevise(): void {
    const conRecord = <FormGroup>this.contactRecordModel.controls.contactDetails;
    if (conRecord.controls.status.value != ContactDetailsService.statusListExternal[1].id) {
      conRecord.controls.status.setValue(ContactDetailsService.statusListExternal[1].id);
    }
    this.saveContactRecord();
  }
  /***
   * Deletes the contact reocord with the selected id from both the model and the form
   */
  public setStatusToRemove(): void {
    const conRecord = <FormGroup>this.contactRecordModel.controls.contactDetails;
    if (conRecord.controls.status.value != ContactDetailsService.statusListExternal[2].id) {
      conRecord.controls.status.setValue(ContactDetailsService.statusListExternal[2].id);
    }
    this.saveContactRecord();
  }
  /***
   * Deletes the contact reocord with the selected id from both the model and the form
   */
  public activeContactRecord(): void {
    const conRecord = <FormGroup>this.contactRecordModel.controls.contactDetails;
    if (conRecord.controls.status.value != ContactDetailsService.statusListExternal[3].id) {
      conRecord.controls.status.setValue(ContactDetailsService.statusListExternal[3].id);
    }
    this.saveContactRecord();
  }

  public saveContactRecord(): void {
    // console.log(this.errorList);
    if (this.contactRecordModel.valid) {
      this.saveRecord.emit((this.contactRecordModel));
      // this.showErrSummary = false;
      // this.showErrors = false;
      this.contactRecordModel.markAsPristine();
    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.contactRecordModel.value.id;
      this.contactRecordModel.controls.id.setValue(1);
      if (this.contactRecordModel.valid) {
        this.contactRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.contactRecordModel));
      } else {
        this.contactRecordModel.controls.id.setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;
      }
    }
  }

  /**
   * Changes the local model back to the last saved version of the contact
   */
  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }

  /**
   * show revise and remove contact button
   */
  public isExternalNotNewContact(): boolean {
    const conRecord = <FormGroup>this.contactRecordModel.controls.contactDetails;
    return (!this.isInternal && conRecord.controls.status.value != 'NEW');
  }

  /**
   * internal site show active contact button
   */
  public isInternalActiveContact(): boolean {
    const conRecord = <FormGroup>this.contactRecordModel.controls.contactDetails;
    return (this.isInternal && conRecord.controls.status.value != 'REMOVE');
  }

  /**
   * External site show delete contact button
   */
  public isExternalNewContact(): boolean {
    return (!this.isInternal && (<FormGroup>this.contactRecordModel.controls.contactDetails).controls.status.value == 'NEW');
  }

  /**
   * Internal site show delete contact button
   */
  public isInternalDeleteContact(): boolean {
    return (this.isInternal && (<FormGroup>this.contactRecordModel.controls.contactDetails).controls.status.value == 'REMOVE');
  }
}
