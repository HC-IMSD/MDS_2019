import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DeviceDetailsComponent} from '../device.details/device.details.component';
import {DeviceRecordService} from './device-record.service';
import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';


@Component({
  selector: 'device-record',
  templateUrl: './device-record.component.html',
  styleUrls: ['./device-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DeviceRecordComponent implements OnInit, AfterViewInit {

  public deviceRecordModel: FormGroup;
  @Input('group') public deviceFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();


  @ViewChild(DeviceDetailsComponent) deviceDetailsChild;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public updateChild: number = 0;
  public sequenceNum: number = 0;
  public errorList = [];
  private childErrorList: Array<any> = [];
  private parentErrorList: Array<any> = [];
  public showErrSummary: boolean;
  public showErrors: boolean;
  public errorSummaryChild: ErrorSummaryComponent = null;
  public headingLevel = 'h4';

  constructor(private _fb: FormBuilder,  private cdr: ChangeDetectorRef) {
    this.showErrors = false;
    this.showErrSummary = false;
  }

  ngOnInit() {
    if (!this.deviceRecordModel) {
      this.deviceRecordModel = this._initDevice();
    }
    this.detailsChanged = 0;

  }
  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Device record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

  }
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Device List found >1 Error Summary ' + list.length);
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
    this.errors.emit(emitErrors);
  }


  private _initDevice() {
    return DeviceRecordService.getReactiveModel(this._fb);
  }

  ngOnChanges (changes: SimpleChanges) {

    if (changes['detailsChanged']) { // used as a change indicator for the model
      if (this.deviceFormRecord) {
        this.setToLocalModel();
      } else {
        this.deviceRecordModel = this._initDevice();
        this.deviceRecordModel.markAsPristine();
      }
      this.updateChild++;
    }
  }

  /***
   *Sets the device record to the internal model
   */
  setToLocalModel() {
    this.deviceRecordModel = this.deviceFormRecord;
    this.sequenceNum = Number(this.deviceRecordModel.controls.id.value) + 1;
    this.deviceRecordModel.markAsPristine();
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
      this.cdr.detectChanges(); // doing our own change detection
    }

    this.errorList = new Array();
    this.errorList = this.parentErrorList.concat(this.childErrorList);
    console.log(this.errorList);
  }

  /**
   * Changes the local model back to the last saved version of the device
   */
  public revertDeviceRecord(): void {
    this.revertRecord.emit(this.deviceRecordModel);
    this.deviceRecordModel.markAsPristine();
  }

  /***
   * Deletes the device reocord with the selected id from both the model and the form
   */
  public deleteDeviceRecord(): void {
    this.deleteRecord.emit(this.deviceRecordModel.value.id);
  }

  public saveDeviceRecord(): void {
    if (this.deviceRecordModel.valid) {
      this.saveRecord.emit((this.deviceRecordModel));
      this.showErrSummary = false;
      this.showErrors = false;
      this.deviceRecordModel.markAsPristine();
    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.deviceRecordModel.value.id;
      this.deviceRecordModel.controls.id.setValue(1);
      if (this.deviceRecordModel.valid) {
        this.deviceRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.deviceRecordModel));
      } else {
        this.deviceRecordModel.controls.id.setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;
      }
    }
  }

  /**
   * Changes the local model back to the last saved version of the device
   */
  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
}
