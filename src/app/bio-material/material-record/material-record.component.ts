import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MaterialDetailsComponent} from '../material.details/material.details.component';
import {MaterialRecordService} from './material-record.service';
import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';
import {isUndefined} from "util";


@Component({
  selector: 'material-record',
  templateUrl: './material-record.component.html',
  styleUrls: ['./material-record.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class MaterialRecordComponent implements OnInit, AfterViewInit {

  public materialRecordModel: FormGroup;
  @Input('group') public materialFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() countries;
  @Input() speciesFamilyList;
  @Input() tissueTypeList;
  @Input() derivativeList;
  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  @Output() errors = new EventEmitter();
  @Output() createRecord; // TODO don't know if needed


  @ViewChild(MaterialDetailsComponent) materialDetailsChild;
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
    if (!this.materialRecordModel) {
      this.materialRecordModel = this._initMaterial();
    }
    this.detailsChanged = 0;

  }
  ngAfterViewInit() {

    this.msgList.changes.subscribe(errorObjs => {
      // update is handled directly in the function
      this.updateErrorList(null, true);
      this._emitErrors();
    });
    /** this is processsing the errorSummary that is a child in  Material record **/
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

  }
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Material List found >1 Error Summary ' + list.length);
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


  private _initMaterial() {
    return MaterialRecordService.getReactiveModel(this._fb);
  }

  ngOnChanges (changes: SimpleChanges) {

    if (changes['detailsChanged']) { // used as a change indicator for the model
      if (this.materialFormRecord) {
        this.setToLocalModel();
      } else {
        this.materialRecordModel = this._initMaterial();
        this.materialRecordModel.markAsPristine();
      }
      this.updateChild++;
    }
  }

  /***
   *Sets the material record to the internal model
   */
  setToLocalModel() {
    this.materialRecordModel = this.materialFormRecord;
    this.sequenceNum = Number(this.materialRecordModel.controls.id.value) + 1;
    this.materialRecordModel.markAsPristine();
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
    // console.log(this.errorList);
  }

  /**
   * Changes the local model back to the last saved version of the material
   */
  public revertMaterialRecord(): void {
    this.revertRecord.emit(this.materialRecordModel);
    this.materialRecordModel.markAsPristine();
  }

  /***
   * Deletes the material reocord with the selected id from both the model and the form
   */
  public deleteMaterialRecord(): void {
    this.errorSummaryChild = null;
    this.deleteRecord.emit(this.materialRecordModel.value.id);
    this._emitErrors();
  }

  public saveMaterialRecord(): void {
    if (this.materialRecordModel.valid) {
      this.saveRecord.emit((this.materialRecordModel));
      this.showErrSummary = false;
      this.showErrors = false;
      this.materialRecordModel.markAsPristine();
    } else {
      // id is used for an error to ensure the record gets saved
      let temp = this.materialRecordModel.value.id;
      this.materialRecordModel.controls.id.setValue(1);
      if (this.materialRecordModel.valid) {
        this.materialRecordModel.controls.id.setValue(temp);
        this.saveRecord.emit((this.materialRecordModel));
      } else {
        this.materialRecordModel.controls.id.setValue(temp);
        this.showErrSummary = true;
        this.showErrors = true;
      }
    }
  }

  /**
   * Changes the local model back to the last saved version of the material
   */
  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
}
