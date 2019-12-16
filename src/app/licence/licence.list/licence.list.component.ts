import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectorRef, DoCheck
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {LicenceRecordComponent} from '../licence-record/licence-record.component';
import {LicenceRecordService} from '../licence-record/licence-record.service';
import {LicenceListService} from './licence-list.service';
import {ListOperations} from '../../list-operations';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../../globals/globals.service';

@Component({
  selector: 'licence-list',
  templateUrl: './licence.list.component.html',
  styleUrls: ['./licence.list.component.css']

})
export class LicenceListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit, DoCheck {
  @Input() public licenceModel = [];
  @Input() public saveLicence;
  @Input() public showErrors: boolean;
  @Input() isInternal: boolean;
  @Output() public errors = new EventEmitter();
  @Output() public licenceModelUpdate = new EventEmitter();

  @ViewChild(LicenceRecordComponent, {static: true}) licenceChild: LicenceRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  // private prevRow = -1;
  public updateLicenceDetails = 0;
  public licenceListForm: FormGroup;
  public newLicenceForm: FormGroup;
  public service: LicenceListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public dataModel = [];
  public validRec = true;
  public columnDefinitions = [
    {
      label: 'Licence Number',
      binding: 'licence_number',
      width: '60'
    },
    {
      label: 'Dossier ID',
      binding: 'dossier_id',
      width: '40'
    }
  ];

  constructor(private _fb: FormBuilder, private translate: TranslateService) {
    super();
    this.service = new LicenceListService();
    this.dataModel = this.service.getModelRecordList();
    this.translate.get('error.msg.required').subscribe(res => {
      console.log(res);
    });
    this.licenceListForm = this._fb.group({
      licences: this._fb.array([])
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
      console.warn('Licence List found >1 Error Summary ' + list.length);
    }
    // console.log('LicenceList process Summaries');
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
   * @private syncs the licence details record with the reactive model. Uses view child functionality
   */
  private _syncCurrentExpandedRow(): void {
    if (this.licenceChild) {
      const licenceFormList = this.getFormLicenceList();
      const result = this.syncCurrentExpandedRow(licenceFormList);
      // Onlu update the results if there is a change. Otherwise the record will not be dirty

      if (result) {
        this.licenceChild.licenceFormRecord = result;
        this.updateLicenceDetails++;
      }
    } else {
      console.warn('There is no licence child');
    }
  }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['saveLicence']) {
      this.saveLicenceRecord(changes['saveLicence'].currentValue);
    }
    if (changes['licenceModel']) {
      this.service.setModelRecordList(changes['licenceModel'].currentValue);
      this.service.initIndex(changes['licenceModel'].currentValue);
      this.dataModel = this.service.getModelRecordList();
      // this.licenceListForm.controls['licences'] = this._fb.array([]);
      this.service.createFormDataList(this.dataModel, this._fb, this.licenceListForm.controls['licences'], this.isInternal);
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
    } else if (this.licenceChild && this.licenceChild.licenceFormRecord) {
      // this.validRec = this.licenceListForm.valid && !this.licenceChild.licenceFormRecord.dirty;
      return (this.licenceListForm.valid && !this.licenceChild.licenceFormRecord.dirty);
    }
    // this.validRec = this.licenceListForm.valid;
    return (this.licenceListForm.valid);
  }

  public getFormLicenceList(): FormArray {
    return <FormArray>(this.licenceListForm.controls['licences']);
  }

  /**
   * returns an licence record with a given id
   * @param {number} id - the identifier for that licence record
   * @returns {FormGroup} -the licence record, null if theere is no match
   * @private
   */
  private _getFormLicence(id: number): FormGroup {
    let licenceList = this.getFormLicenceList();
    return this.getRecord(id, licenceList);
  }

  /**
   * Adds an licence UI record to the licence List
   */
  public addLicence(): void {

    // add licence to the list
    // console.log('adding an licence');
    // 1. Get the list of reactive form Records
    let licenceFormList = <FormArray>this.licenceListForm.controls['licences'];
    // console.log(licenceFormList);
    // 2. Get a blank Form Model for the new record
    let formLicence = LicenceRecordService.getReactiveModel(this._fb, this.isInternal);
    // 3. set record id
    this.service.setRecordId(formLicence, this.service.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formLicence, licenceFormList);
    // console.log(licenceFormList);
    // 5. Set the new form to the new licence form reference.
    this.newLicenceForm = <FormGroup> licenceFormList.controls[licenceFormList.length - 1];

  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveLicenceRecord(record: FormGroup) {
    this.saveRecord(record, this.service);
    this.dataModel = this.service.getModelRecordList();
    this.addRecordMsg++;
    this.validRec = true;
    this.licenceModelUpdate.emit(this.dataModel); // update data model to upper level
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
  public revertLicence(record): void {
    let recordId = record.controls.id.value;

    let modelRecord = this.service.getModelRecord(recordId);
    if (!modelRecord) {
      modelRecord = this.service.getLicenceModel();
      modelRecord.id = recordId;
    }
    let rec = this._getFormLicence(recordId);
    if (rec) {
      LicenceRecordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      // should never happen, there should always be a UI record
      console.warn('LicenceList:rec is null');
    }
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteLicence(id): void {
    let formLicenceList = this.getFormLicenceList();
    this.deleteRecord(id, formLicenceList, this.service);
    this.validRec = true;
    this.deleteRecordMsg++;
    this.dataModel = this.service.getModelRecordList();
    this.licenceModelUpdate.emit(this.dataModel);
  }

  /**
   * check if its record exists
   */
  public isDirty(): boolean {
    if (this.licenceChild && this.licenceChild.licenceFormRecord) {
      return (this.licenceChild.licenceFormRecord.dirty);
    } else {
      return false;
    }
  }


}
