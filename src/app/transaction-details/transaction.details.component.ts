import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {TransactionDetailsService} from './transaction.details.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';
import {forEach} from '@angular/router/src/utils/collection';


@Component({
  selector: 'transaction-details',
  templateUrl: 'transaction.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class TransactionDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public transDetailsFormLocalModel: FormGroup;
  @Input('group') public transDetailsFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() userList;
  @Input() transactionModel;
  @Input() lang;
  @Output() detailErrorList = new EventEmitter(true);
  @Output() isSolicitedFlag = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public actLeadList;
  public actTypeList;
  public transDescList;
  public yesNoList: Array<any> = [];
  public devClassList: Array<any> = [];
  public reasonArray: Array<boolean> = [];
  public reasonResults: Array<boolean> = [];
  public showFieldErrors = false;
  public showDate: boolean;
  public showBriefDesc: boolean;
  private detailsService: TransactionDetailsService;

  constructor(private _fb: FormBuilder,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.showDate = false;
    this.showBriefDesc = false;
    this.actLeadList = [];
    this.actTypeList = [];
    this.transDescList = [];
    this.reasonArray = [false, false, false, false, false, false, false, false, false, false, false];
    this.reasonResults = [false, false, false, false, false, false, false, false, false, false, false];
    this.detailsService = new TransactionDetailsService();
    this.yesNoList = this.detailsService.getYesNoList();
  }

  async ngOnInit() {
    if (!this.transDetailsFormLocalModel) {
      this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;
    this.actLeadList = TransactionDetailsService.getActivityLeads();
    this.devClassList = TransactionDetailsService.getDeviceClassList();
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.detailErrorList.emit(temp);

  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.transDetailsFormRecord) {
        this.setToLocalModel();

      } else {
        this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.transDetailsFormLocalModel.markAsPristine();
      }
    }
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.detailErrorList.emit(temp);
    }
    if (changes['transDetailsFormLocalModel']) {
      // console.log('**********the transaction details changed');
      this.transDetailsFormRecord = this.transDetailsFormLocalModel;
    }
    if (changes['transactionModel']) {
      // console.log('**********the transaction model changed');
      const dataModel = changes['transactionModel'].currentValue;
      if (!this.transDetailsFormLocalModel) {
        this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.transDetailsFormLocalModel.markAsPristine();
      }
      TransactionDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.transDetailsFormLocalModel), this.lang);
      this._updateLists();
      this._setDescFieldFlags(this.transDetailsFormLocalModel.controls.transDescription.value);
    }
    if (changes['userList']) {
      this.userList = changes['userList'].currentValue;
    }
  }
  private  _updateLists() {
    if (this.transDetailsFormLocalModel.controls.activityLead.value === 'Medical Device Bureau') {
      this.actTypeList = TransactionDetailsService.getRawActivityTypes();
    }
    if (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence') {
      this.transDescList = TransactionDetailsService.getLicenceDescriptions(this.lang);
    } else if (this.transDetailsFormLocalModel.controls.activityType.value === 'Fax-back') {
      this.transDescList = TransactionDetailsService.getFaxbackDescriptions(this.lang);
    } else if (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence Amendment') {
      this.transDescList = TransactionDetailsService.getLicenceDescriptions(this.lang);
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.transDetailsFormLocalModel = this.transDetailsFormRecord;
    if (!this.transDetailsFormLocalModel.pristine) {
      this.transDetailsFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    TransactionDetailsService.mapFormModelToDataModel((<FormGroup>this.transDetailsFormLocalModel),
      this.transactionModel);
  }

  activityLeadOnblur() {
    if (this.transDetailsFormLocalModel.controls.activityLead.value &&
      this.transDetailsFormLocalModel.controls.activityLead.value === 'Medical Device Bureau') {
      this.actTypeList = TransactionDetailsService.getRawActivityTypes();
    } else {
      this.actTypeList = [];
      this.transDescList = [];
    }
    this.onblur();
  }

  activityTypeOnblur() {
    if (this.transDetailsFormLocalModel.controls.activityType.value) {
      if (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence') {
        this.transDescList = TransactionDetailsService.getLicenceDescriptions(this.lang);
      } else if (this.transDetailsFormLocalModel.controls.activityType.value === 'Fax-back') {
        this.transDescList = TransactionDetailsService.getFaxbackDescriptions(this.lang);
      } else if (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence Amendment') {
        this.transDescList = TransactionDetailsService.getLicenceDescriptions(this.lang);
      }
      this.transDetailsFormLocalModel.controls.transDescription.setValue(null);
      this.transDetailsFormLocalModel.controls.transDescription.markAsUntouched();
      this.transDetailsFormLocalModel.controls.deviceClass.setValue(false);
      this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
      this._resetReasonValues();
    } else {
      this.transDescList = [];
    }
    this.onblur();
  }

  descrDeviceOnblur() {
    const descValue = this.transDetailsFormLocalModel.controls.transDescription.value;
    if (this.transDetailsFormLocalModel.controls.activityType.value !== 'Licence' && descValue === 'INITIAL' &&
             this.transDetailsFormLocalModel.controls.deviceClass.value) {
      if (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence Amendment') {
        switch (this.transDetailsFormLocalModel.controls.deviceClass.value) {
          case 'DC2':
            this.reasonArray = [true, true, true, false, false, false, false, false, false, true, true];
            break;
          case 'DC3':
            this.reasonArray = [true, true, true, true, true, true, true, true, true, false, true];
            break;
          case 'DC4':
            this.reasonArray = [true, true, true, true, true, true, true, true, true, false, true];
            break;
        }

      } else if (this.transDetailsFormLocalModel.controls.activityType.value === 'Fax-back') {
            this.reasonArray = [false, true, true, false, false, false, false, false, false, false, true];
      }
    } else {
      this.reasonArray = [false, false, false, false, false, false, false, false, false, false, false];
    }
    this._setDescFieldFlags(descValue);
    this._resetReasonValues();
    this.onblur();
  }

  private _setDescFieldFlags(descValue) {
    this.showBriefDesc = (descValue === 'UD') ? true : false;
    this.showDate =  (descValue === 'RAIL' || descValue === 'RS' || descValue === 'MM' || descValue === 'RER') ? true : false;
  }

  private _resetReasonValues() {
    this.reasonResults = [false, false, false, false, false, false, false, false, false, false, false];
    this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
    this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    this.transDetailsFormLocalModel.controls.classChange.setValue(false);
    this.transDetailsFormLocalModel.controls.classChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.licenceChange.setValue(false);
    this.transDetailsFormLocalModel.controls.licenceChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.deviceChange.setValue(false);
    this.transDetailsFormLocalModel.controls.deviceChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.processChange.setValue(false);
    this.transDetailsFormLocalModel.controls.processChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.qualityChange.setValue(false);
    this.transDetailsFormLocalModel.controls.qualityChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.designChange.setValue(false);
    this.transDetailsFormLocalModel.controls.designChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.materialsChange.setValue(false);
    this.transDetailsFormLocalModel.controls.materialsChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.labellingChange.setValue(false);
    this.transDetailsFormLocalModel.controls.labellingChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.safetyChange.setValue(false);
    this.transDetailsFormLocalModel.controls.safetyChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.purposeChange.setValue(false);
    this.transDetailsFormLocalModel.controls.purposeChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.addChange.setValue(false);
    this.transDetailsFormLocalModel.controls.addChange.markAsUntouched();
    this.transDetailsFormLocalModel.controls.licenceNum.setValue(null);
    this.transDetailsFormLocalModel.controls.licenceNum.markAsUntouched();
    this.transDetailsFormLocalModel.controls.appNum.setValue(null);
    this.transDetailsFormLocalModel.controls.appNum.markAsUntouched();
    this.transDetailsFormLocalModel.controls.deviceName.setValue(null);
    this.transDetailsFormLocalModel.controls.deviceName.markAsUntouched();
    this.transDetailsFormLocalModel.controls.requestDate.setValue(null);
    this.transDetailsFormLocalModel.controls.requestDate.markAsUntouched();
    this.transDetailsFormLocalModel.controls.briefDesc.setValue(null);
    this.transDetailsFormLocalModel.controls.briefDesc.markAsUntouched();
  }

  reasonOnblur(int) {
    let itemValue = false;
    switch (int) {
      case 0:
        itemValue = this.transDetailsFormLocalModel.controls.classChange.value;
        break;
      case 1:
        itemValue = this.transDetailsFormLocalModel.controls.licenceChange.value;
        break;
      case 2:
        itemValue = this.transDetailsFormLocalModel.controls.deviceChange.value;
        break;
      case 3:
        itemValue = this.transDetailsFormLocalModel.controls.processChange.value;
        break;
      case 4:
        itemValue = this.transDetailsFormLocalModel.controls.qualityChange.value;
        break;
      case 5:
        itemValue = this.transDetailsFormLocalModel.controls.designChange.value;
        break;
      case 6:
        itemValue = this.transDetailsFormLocalModel.controls.materialsChange.value;
        break;
      case 7:
        itemValue = this.transDetailsFormLocalModel.controls.labellingChange.value;
        break;
      case 8:
        itemValue = this.transDetailsFormLocalModel.controls.safetyChange.value;
        break;
      case 9:
        itemValue = this.transDetailsFormLocalModel.controls.purposeChange.value;
        break;
      case 10:
        itemValue = this.transDetailsFormLocalModel.controls.addChange.value;
        break;
    }
    if (itemValue) {
      this.transDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
      this.reasonResults[int] = true;
    } else {
      this.reasonResults[int] = false;
      this._resetReasonFlag();
    }
    this.onblur();
  }

  private _resetReasonFlag() {
    this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
    for (let reason of this.reasonResults){
      if (reason) {
        this.transDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
        break;
      }
    }
  }

  isInitial() {
    return (this.transDetailsFormLocalModel.controls.transDescription.value === 'INITIAL');
  }

  isLicence() {
    return (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence');
  }

  isClassSet() {
    return (this.transDetailsFormLocalModel.controls.deviceClass.value);
  }

  isNotInitial() {
    return (this.transDetailsFormLocalModel.controls.transDescription.value && !this.isInitial());
  }

  isDescInitial() {
    if (this.isInitial()) {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
      this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
      this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
      this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    }
    return false;
  }

  // isInitialNotLicence() {
  //   if (this.isInitial() && this.transDetailsFormLocalModel.controls.activityType.value && !this.isLicence()) {
  //       return true;
  //   } else {
  //     this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
  //     this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
  //     this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
  //     this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
  //   }
  //   return false;
  // }

  isInitialNotLicenceDCSet() {
    if (this.isInitial() && !this.isLicence() && this.isClassSet()) {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
      this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
      this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
      this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    }
    return false;
  }

  isInitialAndLicence() {
    if (this.isInitial() && this.isLicence()) {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.deviceName.setValue(null);
      this.transDetailsFormLocalModel.controls.deviceName.markAsUntouched();
    }
    return false;
  }

  isUnsolicited() {
    if (this.transDetailsFormLocalModel.controls.transDescription.value === 'UD') {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.isSolicitedInfo.setValue(null);
      this.transDetailsFormLocalModel.controls.isSolicitedInfo.markAsUntouched();
    }
    return false;
  }

  isNotInitialMmUd() {
    if (this.isNotInitial() && (this.transDetailsFormLocalModel.controls.transDescription.value !== 'MM' ||
          this.transDetailsFormLocalModel.controls.transDescription.value !== 'UD')) {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.appNum.setValue(null);
      this.transDetailsFormLocalModel.controls.appNum.markAsUntouched();
    }
    return false;
  }

  isMmUd() {
    if (this.transDetailsFormLocalModel.controls.transDescription.value === 'MM' ||
        this.transDetailsFormLocalModel.controls.transDescription.value === 'UD') {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.appNumOpt.setValue(null);
      this.transDetailsFormLocalModel.controls.appNumOpt.markAsUntouched();
    }
    return false;
  }

  isHasDdtMandatory() {
    if (this.isInitialAndLicence() || this.transDetailsFormLocalModel.controls.deviceChange.value) {
      this.transDetailsFormLocalModel.controls.hasDdt.setValue(null);
      this.transDetailsFormLocalModel.controls.hasDdt.markAsUntouched();
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.hasDdtMan.setValue(null);
      this.transDetailsFormLocalModel.controls.hasDdtMan.markAsUntouched();
    }
    return false;
  }

  getReasonArrayVelue(index) {
    return this.reasonArray[index];
  }
}

