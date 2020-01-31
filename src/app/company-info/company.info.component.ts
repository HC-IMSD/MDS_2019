import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {CompanyInfoService} from './company.info.service';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';


@Component({
  selector: 'com-gen-info',
  templateUrl: 'company.info.component.html',
  encapsulation: ViewEncapsulation.None
})

/**
 *  Company Info Component is used for Company Form
 */
export class CompanyInfoComponent implements OnInit, OnChanges, AfterViewInit {

  public generalInfoFormLocalModel: FormGroup;
  @Input('group') public generalInfoFormRecord: FormGroup;
  @Input() genInfoModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
 // @Input() inComplete: boolean;
  @Input() isInternal: boolean;
  @Input() helpTextSequences;
  @Output() errorList = new EventEmitter(true);
  @Output() showAdminChanges = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public isAmend = false;
  public showFieldErrors: boolean;
  public setAsComplete = false;
  public yesNoList: Array<any> = [];
  public reasonFlags: Array<boolean> = [];

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.yesNoList = CompanyInfoService.getYesNoList();
    this.reasonFlags = [false, false, false, false]; // 0: show admin section; 1,2,3: amend reasons.
  }

  ngOnInit() {
    if (!this.generalInfoFormLocalModel) {
      this.generalInfoFormLocalModel = CompanyInfoService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;
    console.log('this.isInternal: ' + this.isInternal);
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);

      /* errorObjs.forEach(
         error => {
           temp.push(error);
         }
       );
       this.errorList.emit(temp);*/
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
    this.errorList.emit(temp);

  }

  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.generalInfoFormRecord) {
        this.setToLocalModel();

      } else {
        this.generalInfoFormLocalModel = CompanyInfoService.getReactiveModel(this._fb);
        this.generalInfoFormLocalModel.markAsPristine();
      }
      if (this.generalInfoFormLocalModel ) {
        CompanyInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel),
          this.genInfoModel);
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
      this.errorList.emit(temp);
    }
    if (changes['isInternal']) {
      if (!changes['isInternal'].currentValue) {
        this.setAsComplete = (this.genInfoModel.status === GlobalsService.FINAL && !changes['isInternal'].currentValue);
      } // && this.isInternal;
    }
    if (changes['genInfoModel']) {
      const dataModel = changes['genInfoModel'].currentValue;
      CompanyInfoService.mapDataModelToFormModel(dataModel,
        (<FormGroup>this.generalInfoFormLocalModel));
      this.setAsComplete = (dataModel.status === GlobalsService.FINAL && !this.isInternal);
      this.isAmend = (dataModel.status === GlobalsService.AMEND);
      this.amendReasonOnblur();
    }

  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.generalInfoFormLocalModel = this.generalInfoFormRecord;
    if (!this.generalInfoFormLocalModel.pristine) {
      this.generalInfoFormLocalModel.markAsPristine();
    }
  }

  removed(rec) {
    console.log(rec);
  }

  // showAmendMsg() {
  //
  //   if (!this.generalInfoFormLocalModel) {
  //     return false;
  //   }
  //   return this.generalInfoFormLocalModel.controls.formStatus.value === GlobalsService.AMEND;
  // }

  disableAmend () {
    return !this.isInternal;
  }

  public setAmendState () {
    this.isAmend = true;
    this.genInfoModel.status = CompanyInfoService.setAmendStatus();
    this.genInfoModel.are_licenses_transfered = '';
    CompanyInfoService.mapDataModelToFormModel(this.genInfoModel,
      (<FormGroup>this.generalInfoFormLocalModel));
  }

  onblur() {
    // console.log('input is typed');
    CompanyInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel),
      this.genInfoModel);
  }

  nameChangeOnblur() {
    // console.log('input is onblur');
    this.reasonFlags[1] = this.generalInfoFormLocalModel.controls.nameChange.value;
    this.amendReasonOnblur();
  }

  addressChangeOnblur() {
    // console.log('input is onblur');
    this.reasonFlags[2] = this.generalInfoFormLocalModel.controls.addressChange.value;
    this.amendReasonOnblur();
  }

  facilityChangeOnblur() {
    // console.log('input is onblur');
    this.reasonFlags[3] = this.generalInfoFormLocalModel.controls.facilityChange.value;
    this.amendReasonOnblur();
  }

  amendReasonOnblur() {
    // console.log('input is onblur');
    this._hasReasonChecked();
    this.reasonFlags[0] = (this.generalInfoFormLocalModel.controls.areLicensesTransfered.value === GlobalsService.YES) ||
      this.reasonFlags[1] || this.reasonFlags[2] || this.reasonFlags[3];
    this.onblur();
    this.showAdminChanges.emit(this.reasonFlags);
  }

  isOther() {
    return this.generalInfoFormLocalModel.controls.otherChange.value;
  }

  private _hasReasonChecked() {
    this.generalInfoFormLocalModel.controls.amendReason.setValue(null);
    if (this.generalInfoFormLocalModel.controls.nameChange.value ||
      this.generalInfoFormLocalModel.controls.addressChange.value ||
      this.generalInfoFormLocalModel.controls.facilityChange.value ||
      this.generalInfoFormLocalModel.controls.otherChange.value) {
      this.generalInfoFormLocalModel.controls.amendReason.setValue('reasonFilled');
    }
  }
}

