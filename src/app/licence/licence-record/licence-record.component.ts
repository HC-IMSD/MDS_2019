import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LicenceDetailsComponent} from '../licence.details/licence.details.component';
import {LicenceRecordService} from './licence-record.service';
import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';


@Component({
  selector: 'licence-record',
  templateUrl: './licence-record.component.html',
  styleUrls: ['./licence-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class LicenceRecordComponent implements OnInit, AfterViewInit {

  public licenceRecordModel: FormGroup;
  @Input('group') public licenceFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() isInternal: boolean;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();


  @ViewChild(LicenceDetailsComponent) licenceDetailsChild;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  public showErrSummary: boolean;
  public errorSummaryChild: ErrorSummaryComponent = null;
  public headingLevel = 'h4';

  constructor(private _fb: FormBuilder,  private cdr: ChangeDetectorRef) {
    this.showErrors = false;
    this.showErrSummary = false;
  }

  ngOnInit() {
    if (!this.licenceRecordModel) {
      this.licenceRecordModel = this._initLicence();
    }
    this.detailsChanged = 0;

  }
  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Licence record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

  }
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Licence List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
    if (this.errorSummaryChild) {
      this.errorSummaryChild.tableId = 'licenceListTable';
    }
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


  private _initLicence() {
    return LicenceRecordService.getReactiveModel(this._fb, this.isInternal);
  }

  ngOnChanges (changes: SimpleChanges) {

    if (changes['detailsChanged']) { // used as a change indicator for the model
      if (this.licenceFormRecord) {
        this.setToLocalModel();
      } else {
        this.licenceRecordModel = this._initLicence();
        this.licenceRecordModel.markAsPristine();
      }
      this.updateChild++;
    }
    if (this.isInternal) {
      if (changes['showErrors']) {
        this.showErrSummary = changes['showErrors'].currentValue;
        this._emitErrors();
      }
      this.cdr.detectChanges(); // doing our own change detection
    }
  }

  /***
   *Sets the licence record to the internal model
   */
  setToLocalModel() {
    this.licenceRecordModel = this.licenceFormRecord;
    this.sequenceNum = Number(this.licenceRecordModel.controls.id.value) + 1;
    this.licenceRecordModel.markAsPristine();
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
    }

    this.errorList = new Array();
    this.errorList = this.parentErrorList.concat(this.childErrorList);
    // console.log(this.errorList);
    this.cdr.detectChanges(); // doing our own change detection
  }

  /**
   * Changes the local model back to the last saved version of the licence
   */
  public revertLicenceRecord(): void {
    this.revertRecord.emit(this.licenceRecordModel);
    this.licenceRecordModel.markAsPristine();
  }

  /***
   * Deletes the licence reocord with the selected id from both the model and the form
   */
  public deleteLicenceRecord(): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(this.licenceRecordModel.value.id);
    this._emitErrors();
  }

  public saveLicenceRecord(): void {
    if (this.licenceRecordModel.valid) {
      this.saveRecord.emit((this.licenceRecordModel));
      this.showErrSummary = false;
      this.showErrors = false;
      this.licenceRecordModel.markAsPristine();
    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.licenceRecordModel.value.id;
      this.licenceRecordModel.controls.id.setValue(1);
      if (this.licenceRecordModel.valid) {
        this.licenceRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.licenceRecordModel));
      } else {
        this.licenceRecordModel.controls.id.setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;
      }
    }
  }

  /**
   * Changes the local model back to the last saved version of the licence
   */
  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
}
