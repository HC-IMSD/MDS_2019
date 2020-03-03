import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectorRef, DoCheck, ViewEncapsulation
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {RequesterRecordComponent} from '../requester-record/requester-record.component';
import {RequesterRecordService} from '../requester-record/requester-record.service';
import {RequesterListService} from './requester-list.service';
import {ListOperations} from '../../list-operations';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../../globals/globals.service';

@Component({
  selector: 'requester-list',
  templateUrl: './requester.list.component.html',
  styleUrls: ['./requester.list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class RequesterListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit, DoCheck {
  @Input() public requesterModel = [];
  @Input() public saveRequester;
  @Input() public showErrors: boolean;
  @Input() userList;
  @Output() public errors = new EventEmitter();

  @ViewChild(RequesterRecordComponent, {static: true}) requesterChild: RequesterRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  public updateRequesterDetails = 0;
  public requesterListForm: FormGroup;
  public newRequesterForm: FormGroup;
  public service: RequesterListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public dataModel = [];
  public validRec = true;
  public columnDefinitions = [
    {
      label: 'Requester of Solicited Information',
      binding: 'requester_text',
      width: '100'
    }
  ];

  constructor(private _fb: FormBuilder, private translate: TranslateService) {
    super();
    this.service = new RequesterListService();
    this.service.userList = this.userList;
    this.dataModel = this.service.getModelRecordList();
    this.translate.get('error.msg.required').subscribe(res => {
      console.log(res);
    });
    this.requesterListForm = this._fb.group({
      requesters: this._fb.array([])
    });
  }

  ngOnInit() {
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
      console.warn('Requester List found >1 Error Summary ' + list.length);
    }
    // console.log('RequesterList process Summaries');
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
   * @private syncs the requester details record with the reactive model. Uses view child functionality
   */
  private _syncCurrentExpandedRow(): void {
    if (this.requesterChild) {
      const requesterFormList = this.getFormRequesterList();
      const result = this.syncCurrentExpandedRow(requesterFormList);
      // Onlu update the results if there is a change. Otherwise the record will not be dirty

      if (result) {
        this.requesterChild.requesterFormRecord = result;
        this.updateRequesterDetails++;
      }
    } else {
      console.warn('There is no requester child');
    }
  }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['saveRequester']) {
      this.saveRequesterRecord(changes['saveRequester'].currentValue);
    }
    if (changes['requesterModel']) {
      this.service.setModelRecordList(changes['requesterModel'].currentValue);
      this.service.initIndex(changes['requesterModel'].currentValue);
      this.dataModel = this.service.getModelRecordList();
      this.service.createFormDataList(this.dataModel, this._fb, this.requesterListForm.controls['requesters'], this.userList);
      this.validRec = true;
    }
    if (changes['userList']) {
      this.userList = changes['userList'].currentValue;
      this.service.userList = this.userList;
    }

  }

  public isValid(override: boolean = false): boolean {
    if (override) {
      return true;
    }
    if (this.newRecordIndicator) {
      this.validRec = false;
      return false;
    } else if (this.requesterChild && this.requesterChild.requesterFormRecord) {
      this.validRec = this.requesterListForm.valid && !this.requesterChild.requesterFormRecord.dirty;
      return (this.requesterListForm.valid && !this.requesterChild.requesterFormRecord.dirty);
    }
    this.validRec = this.requesterListForm.valid;
    return (this.requesterListForm.valid);
  }

  public getFormRequesterList(): FormArray {
    return <FormArray>(this.requesterListForm.controls['requesters']);
  }

  /**
   * returns an requester record with a given id
   * @param {number} id - the identifier for that requester record
   * @returns {FormGroup} -the requester record, null if theere is no match
   * @private
   */
  private _getFormRequester(id: number): FormGroup {
    let requesterList = this.getFormRequesterList();
    return this.getRecord(id, requesterList);
  }

  /**
   * Adds an requester UI record to the requester List
   */
  public addRequester(): void {

    // add requester to the list
    // console.log('adding an requester');
    // 1. Get the list of reactive form Records
    let requesterFormList = <FormArray>this.requesterListForm.controls['requesters'];
    console.log(requesterFormList);
    // 2. Get a blank Form Model for the new record
    let formRequester = RequesterRecordService.getReactiveModel(this._fb);
    // 3. set record id
    this.service.setRecordId(formRequester, this.service.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formRequester, requesterFormList);
    console.log(requesterFormList);
    // 5. Set the new form to the new requester form reference.
    this.newRequesterForm = <FormGroup> requesterFormList.controls[requesterFormList.length - 1];

  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveRequesterRecord(record: FormGroup) {
    this.saveRecord(record, this.service);
    this.dataModel = this.service.getModelRecordList();
    this.addRecordMsg++;
    this.validRec = true;
  }

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
  public revertRequester(record): void {
    let recordId = record.controls.id.value;

    let modelRecord = this.service.getModelRecord(recordId);
    if (!modelRecord) {
      modelRecord = this.service.getRequesterModel();
      modelRecord.id = recordId;
    }
    let rec = this._getFormRequester(recordId);
    if (rec) {
      RequesterRecordService.mapDataModelFormModel(modelRecord, rec, this.userList);
    } else {
      // should never happen, there should always be a UI record
      console.warn('RequesterList:rec is null');
    }
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteRequester(id): void {
    let requesterList = this.getFormRequesterList();
    this.deleteRecord(id, requesterList, this.service);
    this.validRec = true;
    this.deleteRecordMsg++;
  }

  /**
   * check if its record exists
   */
  public isDirty(): boolean {
    if (this.requesterChild && this.requesterChild.requesterFormRecord) {
      return (this.requesterChild.requesterFormRecord.dirty);
    } else {
      return false;
    }
  }


}
