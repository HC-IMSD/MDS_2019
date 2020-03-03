import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RequesterDetailsComponent} from '../requester.details/requester.details.component';
import {RequesterRecordService} from './requester-record.service';
import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';


@Component({
  selector: 'requester-record',
  templateUrl: './requester-record.component.html',
  styleUrls: ['./requester-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class RequesterRecordComponent implements OnInit, AfterViewInit {

  public requesterRecordModel: FormGroup;
  @Input('group') public requesterFormRecord: FormGroup;
  @Input() public requesterModel;
  @Input() public showErrors: boolean;
  @Input() detailsChanged: number;
  @Input() userList: Array<any>;
  @Input() newRecordIndicator: boolean;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();


  @ViewChild(RequesterDetailsComponent, {static: true}) requesterDetailsChild;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  public showErrSummary: boolean;
  // public showErrors: boolean;
  public errorSummaryChild: ErrorSummaryComponent = null;
  public headingLevel = 'h4';

  constructor(private _fb: FormBuilder,  private cdr: ChangeDetectorRef) {
    // this.showErrors = false;
    this.showErrSummary = false;
  }

  ngOnInit() {
    if (!this.requesterRecordModel) {
      this.requesterRecordModel = this._initRequester();
    }
    this.detailsChanged = 0;

  }
  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Requester record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

  }
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Requester List found >1 Error Summary ' + list.length);
    }
    this.errorSummaryChild = list.first;
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
    // console.log('requester record - emitErrors: ' + emitErrors);
    this.errors.emit(emitErrors);
  }


  private _initRequester() {
    return RequesterRecordService.getReactiveModel(this._fb);
  }

  ngOnChanges (changes: SimpleChanges) {

    if (changes['detailsChanged']) { // used as a change indicator for the model
      if (this.requesterFormRecord) {
        this.setToLocalModel();
      } else {
        this.requesterRecordModel = this._initRequester();
        this.requesterRecordModel.markAsPristine();
      }
      this.updateChild++;
    }

    if (changes['showErrors']) {
      this.showErrSummary = changes['showErrors'].currentValue;
    }
  }

  /***
   *Sets the requester record to the internal model
   */
  setToLocalModel() {
    this.requesterRecordModel = this.requesterFormRecord;
    this.sequenceNum = Number(this.requesterRecordModel.controls.id.value) + 1;
    this.requesterRecordModel.markAsPristine();
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
    console.log('requester record - updateErrorList: ' + this.errorList);
    if ( this.errorList[0] && this.errorList[0].currentError) {
      this.showErrSummary = true;
    }
    this._emitErrors();
    // this.cdr.detectChanges(); // doing our own change detection
  }

  /**
   * Changes the local model back to the last saved version of the requester
   */
  public revertRequesterRecord(): void {
    this.revertRecord.emit(this.requesterRecordModel);
    this.requesterRecordModel.markAsPristine();
  }

  /***
   * Deletes the requester reocord with the selected id from both the model and the form
   */
  public deleteRequesterRecord(): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(this.requesterRecordModel.value.id);
    this._emitErrors();
  }

  public saveRequesterRecord(record: FormGroup): void {
    if (this.requesterRecordModel.valid) {
      this.saveRecord.emit((this.requesterRecordModel));
      this.requesterRecordModel.markAsPristine();
      this.errors.emit([]);
    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.requesterRecordModel.value.id;
      this.requesterRecordModel.controls.id.setValue(1);
      if (this.requesterRecordModel.valid) {
        this.requesterRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.requesterRecordModel));
      } else {
        this.requesterRecordModel.controls.id.setValue(temp);
        RequesterRecordService.mapFormModelToDataModel(this.requesterRecordModel, this.requesterModel, this.userList);
        this._emitErrors();
      }
    }
  }

  /**
   * Changes the local model back to the last saved version of the requester
   */
  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
}
