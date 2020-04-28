import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectorRef, DoCheck, ViewEncapsulation
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {DeviceRecordComponent} from '../device-record/device-record.component';
import {DeviceRecordService} from '../device-record/device-record.service';
import {DeviceListService} from './device-list.service';
import {ListOperations} from '../../list-operations';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../../globals/globals.service';

@Component({
  selector: 'device-list',
  templateUrl: './device.list.component.html',
  styleUrls: ['./device.list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class DeviceListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit, DoCheck {
  @Input() public deviceModel = [];
  @Input() public saveDevice;
  @Input() public showErrors: boolean;
  @Output() public errors = new EventEmitter();

  @ViewChild(DeviceRecordComponent, {static: true}) deviceChild: DeviceRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  // private prevRow = -1;
  public updateDeviceDetails = 0;
  public deviceListForm: FormGroup;
  public newDeviceForm: FormGroup;
  public service: DeviceListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public dataModel = [];
  public validRec = true;
  // public recModified = false;

  public columnDefinitions = [
    {
      label: 'Name of Compatible Device',
      binding: 'device_name',
      width: '65'
    },
    {
      label: 'Licence Number',
      binding: 'licence_number',
      width: '35'
    }
  ];

  constructor(private _fb: FormBuilder, private translate: TranslateService) {
    super();
    this.service = new DeviceListService();
    this.dataModel = this.service.getModelRecordList();
    this.translate.get('error.msg.required').subscribe(res => {
      // console.log(res);
    });
    this.deviceListForm = this._fb.group({
      devices: this._fb.array([])
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
      console.warn('Device List found >1 Error Summary ' + list.length);
    }
    // console.log('DeviceList process Summaries');
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
   * @private syncs the device details record with the reactive model. Uses view child functionality
   */
  private _syncCurrentExpandedRow(): void {
    if (this.deviceChild) {
      const deviceFormList = this.getFormDeviceList();
      const result = this.syncCurrentExpandedRow(deviceFormList);
      // Onlu update the results if there is a change. Otherwise the record will not be dirty

      if (result) {
        this.deviceChild.deviceFormRecord = result;
        this.updateDeviceDetails++;
      }
    } else {
      console.warn('There is no device child');
    }
  }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['saveDevice']) {
      this.saveDeviceRecord(changes['saveDevice'].currentValue);
    }
    if (changes['deviceModel']) { // && changes['deviceModel'].currentValue && changes['deviceModel'].currentValue.length > 0) {
      this.service.setModelRecordList(changes['deviceModel'].currentValue);
      this.service.initIndex(changes['deviceModel'].currentValue);
      this.dataModel = this.service.getModelRecordList();
      // this.deviceListForm.controls['devices'] = this._fb.array([]);
      this.service.createFormDataList(this.dataModel, this._fb, this.deviceListForm.controls['devices']);
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
    } else if (this.deviceChild && this.deviceChild.deviceFormRecord) {
      this.validRec = this.deviceListForm.valid && !this.deviceChild.deviceFormRecord.dirty;
      return (this.deviceListForm.valid && !this.deviceChild.deviceFormRecord.dirty);
    }
    this.validRec = this.deviceListForm.valid;
    return (this.deviceListForm.valid);
  }

  public getFormDeviceList(): FormArray {
    return <FormArray>(this.deviceListForm.controls['devices']);
  }

  /**
   * returns an device record with a given id
   * @param {number} id - the identifier for that device record
   * @returns {FormGroup} -the device record, null if theere is no match
   * @private
   */
  private _getFormDevice(id: number): FormGroup {
    let deviceList = this.getFormDeviceList();
    return this.getRecord(id, deviceList);
  }

  /**
   * Adds an device UI record to the device List
   */
  public addDevice(): void {

    // add device to the list
    // console.log('adding an device');
    // 1. reset modification flag and get the list of reactive form Records
    // this.recModified = false;
    let deviceFormList = <FormArray>this.deviceListForm.controls['devices'];
    // console.log(deviceFormList);
    // 2. Get a blank Form Model for the new record
    let formDevice = DeviceRecordService.getReactiveModel(this._fb);
    // 3. set record id
    this.service.setRecordId(formDevice, this.service.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formDevice, deviceFormList);
    // console.log(deviceFormList);
    // 5. Set the new form to the new device form reference.
    this.newDeviceForm = <FormGroup> deviceFormList.controls[deviceFormList.length - 1];
    this.updateDeviceDetails++;

  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveDeviceRecord(record: FormGroup) {
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

    const deviceFormList = this.getFormDeviceList();
    if (deviceFormList && deviceFormList.length > 0) {
      this._emitErrors(); // needed or will generate a valuechanged error
    }
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
  public revertDevice(record): void {
    let recordId = record.controls.id.value;

    let modelRecord = this.service.getModelRecord(recordId);
    if (!modelRecord) {
      modelRecord = this.service.getDeviceModel();
      modelRecord.id = recordId;
    }
    let rec = this._getFormDevice(recordId);
    if (rec) {
      DeviceRecordService.mapDataModelFormModel(modelRecord, rec);
    } else {
      // should never happen, there should always be a UI record
      console.warn('DeviceList:rec is null');
    }
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteDevice(id): void {
    const deviceList = this.getFormDeviceList();
    this.deleteRecord(id, deviceList, this.service);
    this.validRec = true;
    this.deleteRecordMsg++;
    this.deviceChild.deviceFormRecord.reset('dirty');
    this._emitErrors();
    document.location.href = '#addDevice';
  }

  /**
   * check if its record exists
   */
  public isDirty(): boolean {
      const isd = !(this.deviceListForm.valid || !this.deviceListForm.errors);
      return (isd || this.deviceListForm.dirty || this.newRecordIndicator);
  }


}
