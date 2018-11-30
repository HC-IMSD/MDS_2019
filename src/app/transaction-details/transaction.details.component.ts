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
  @Input() requesterModel;
  @Input() transFeesModel;
  @Input() lang;
  @Output() detailErrorList = new EventEmitter(true);
  @Output() requesterErrorList = new EventEmitter(true);
  @Output() transFeesErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public actLeadList;
  public actTypeList;
  public transDescList;
  public yesNoList: Array<any> = [];
  public devClassList: Array<any> = [];
  public reasonArray: Array<boolean> = [];
  public showFieldErrors = false;
  private detailsService: TransactionDetailsService;

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    // todo: dataLoader = new DossierDataLoaderService(this.http);
    this.showFieldErrors = false;
    this.showErrors = false;
    this.actLeadList = [];
    this.actTypeList = [];
    this.transDescList = [];
    this.reasonArray = [false, false, false, false, false, false, false, false, false, false];
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
      console.log('**********the DOSSIER details changed');
      this.transDetailsFormRecord = this.transDetailsFormLocalModel;
    }
    if (changes['transactionModel']) {
      const dataModel = changes['transactionModel'].currentValue;
      if (!this.transDetailsFormLocalModel) {
        this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.transDetailsFormLocalModel.markAsPristine();
      }
      TransactionDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.transDetailsFormLocalModel), this.lang);
    }
    if (changes['userList']) {
      this.userList = changes['userList'].currentValue;
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
        this.transDescList = TransactionDetailsService.getLicenceDescriptions();
      } else if (this.transDetailsFormLocalModel.controls.activityType.value === 'Fax-back') {
        this.transDescList = TransactionDetailsService.getFaxbackDescriptions();
      } else if (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence Amendment') {
        this.transDescList = TransactionDetailsService.getLicenceDescriptions();
      }
    } else {
      this.transDescList = [];
    }
    this.onblur();
  }

  descrDeviceOnblur() {
    if (this.transDetailsFormLocalModel.controls.activityType.value !== 'Licence' &&
             this.transDetailsFormLocalModel.controls.transDescription.value &&
             this.transDetailsFormLocalModel.controls.transDescription.value.id === 'INITIAL' &&
             this.transDetailsFormLocalModel.controls.deviceClass.value) {
      if (this.transDetailsFormLocalModel.controls.activityType.value.id === 'Licence Amendment') {
        switch (this.transDetailsFormLocalModel.controls.deviceClass.value) {
          case 'DC2':
            this.reasonArray = [true, true, false, false, false, false, false, false, true, true];
            break;
          case 'DC3':
            this.reasonArray = [true, true, true, true, true, true, true, true, false, true];
            break;
          case 'DC4':
            this.reasonArray = [true, true, true, true, true, true, true, true, false, true];
            break;
        }

      } else if (this.transDetailsFormLocalModel.controls.activityType.value.id === 'Fax-back') {
            this.reasonArray = [false, true, false, false, false, false, false, false, false, true];
      }
    } else {
      this.reasonArray = [false, false, false, false, false, false, false, false, false, false];
      this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
      this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
      this.transDetailsFormLocalModel.controls.classChange.setValue(false);
      this.transDetailsFormLocalModel.controls.classChange.markAsUntouched();
      this.transDetailsFormLocalModel.controls.licenceChange.setValue(false);
      this.transDetailsFormLocalModel.controls.licenceChange.markAsUntouched();
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
    }
    this.onblur();
  }

  reasonOnblur(int) {
    if (this.transDetailsFormLocalModel.controls.classChange.value) {
      this.transDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
      this.reasonArray[int] = true;
    } else {
      this.reasonArray[int] = false;
      this.resetReasonFlag();
    }
    this.onblur();
  }

  resetReasonFlag() {
    this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
    for (let reason of this.reasonArray){
      if (reason) {
        this.transDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
        break;
      }
    }
  }

  processRequesterErrors(errorList) {
    this.requesterErrorList.emit(errorList);

  }

  processTransFeesErrors(errorList) {
    this.transFeesErrorList.emit(errorList);
  }

  isInitial() {
    if (this.transDetailsFormLocalModel.controls.transDescription.value) {
      if (this.transDetailsFormLocalModel.controls.transDescription.value.id === 'INITIAL') {
        return true;
      }
    }
    return false;
  }

  isLicence() {
    if (this.transDetailsFormLocalModel.controls.activityType.value) {
      if (this.transDetailsFormLocalModel.controls.activityType.value === 'Licence') {
        return true;
      }
    }
    return false;
  }

  isInitialNotLicence() {
    if (this.isInitial() && !this.isLicence()) {
        return true;
    } else {
      this.transDetailsFormLocalModel.controls.deviceClass.setValue(null);
      this.transDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
      this.transDetailsFormLocalModel.controls.amendReason.setValue(null);
      this.transDetailsFormLocalModel.controls.amendReason.markAsUntouched();
      this.transDetailsFormLocalModel.controls.licenceNum.setValue(null);
      this.transDetailsFormLocalModel.controls.licenceNum.markAsUntouched();
    }
    return false;
  }
}

