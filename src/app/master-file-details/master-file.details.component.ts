import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {MasterFileDetailsService} from './master-file.details.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';
// import {forEach} from '@angular/router/src/utils/collection';


@Component({
  selector: 'master-file-details',
  templateUrl: 'master-file.details.component.html',
  encapsulation: ViewEncapsulation.None

})

/**
 * Sample component is used for nothing
 */
export class MasterFileDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public mfDetailsFormLocalModel: FormGroup;
  @Input('group') public mfDetailsFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() userList;
  @Input() masterFileModel;
  @Input() lang;
  @Input() helpIndex;
  @Output() detailErrorList = new EventEmitter(true);
  @Output() isSolicitedFlag = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public actLeadList;
  public actTypeList;
  public mfDescList;
  public yesNoList: Array<any> = [];
  public devClassList: Array<any> = [];
  public reasonArray: Array<boolean> = [];
  public reasonResults: Array<boolean> = [];
  public showFieldErrors = false;
  public showDate: boolean;
  public showBriefDesc: boolean;
  private detailsService: MasterFileDetailsService;
  public rawActTypes;
  public rawDescTypes;
  private showVersion: boolean;
  private rawDescMap;
  // public showRationalRequired: boolean;
  // public showProposeIndication: boolean;
  public showPeriod: boolean;

  constructor(private _fb: FormBuilder,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.showDate = false;
    this.showBriefDesc = false;
    this.actLeadList = [];
    this.actTypeList = [];
    this.mfDescList = [];
    this.reasonArray = [false, false, false, false, false, false, false, false, false, false, false];
    this.reasonResults = [false, false, false, false, false, false, false, false, false, false, false];
    this.detailsService = new MasterFileDetailsService();
    this.yesNoList = this.detailsService.getYesNoList();
    this.rawActTypes = MasterFileDetailsService.getRawActivityTypeList();
    this.rawDescTypes = MasterFileDetailsService.getRawMFDescList();
    this.rawDescMap = MasterFileDetailsService.getDescMap();
    if (!this.mfDetailsFormLocalModel) {
      this.mfDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
    }
    this.showPeriod = false;
  }

  async ngOnInit() {
    this.detailsChanged = 0;
    this.actLeadList = MasterFileDetailsService.getActivityLeadList(this.lang);
    this.devClassList = MasterFileDetailsService.getDeviceClassList();
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      const temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    const temp = [];
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
      if (this.mfDetailsFormRecord) {
        this.setToLocalModel();

      } else {
        this.mfDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.mfDetailsFormLocalModel.markAsPristine();
      }
    }
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      const temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.detailErrorList.emit(temp);
    }
    if (changes['mfDetailsFormLocalModel']) {
      // console.log('**********the master-file details changed');
      this.mfDetailsFormRecord = this.mfDetailsFormLocalModel;
    }
    if (changes['masterFileModel']) {
      // console.log('**********the masterFile model changed');
      const dataModel = changes['masterFileModel'].currentValue;
      if (!this.mfDetailsFormLocalModel) {
        this.mfDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.mfDetailsFormLocalModel.markAsPristine();
      }
      MasterFileDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.mfDetailsFormLocalModel), this.lang);
      this._updateLists();
      this._setDescFieldFlags(this.mfDetailsFormLocalModel.controls.descriptionType.value);
    }
    if (changes['userList']) {
      this.userList = changes['userList'].currentValue;
    }
  }
  private  _updateLists() {
    if (this.actLeadList && this.actLeadList.length > 0 ) {
      if (this.mfDetailsFormLocalModel.controls.activityLead.value === this.actLeadList[0].id) {
        this.actTypeList = MasterFileDetailsService.getActivityTypeMDBList(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityLead.value === this.actLeadList[1].id) {
        this.actTypeList = MasterFileDetailsService.getActivityTypePVList(this.lang);
      }
    }

    if (this.rawActTypes && this.rawActTypes.length > 0 ) {
      if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[1].id) { // 'B02-20160301-039'
        this.mfDescList = MasterFileDetailsService.getLicenceDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[0].id) { // 'B02-20160301-033'
        this.mfDescList = MasterFileDetailsService.getFaxbackDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[2].id) { // 'B02-20160301-040'
        this.mfDescList = MasterFileDetailsService.getLicenceDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[3].id) { // 'B02-20160301-081'
        this.mfDescList = MasterFileDetailsService.getS36394041Descriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[4].id) { // 'B02-20190627-02'
        this.mfDescList = MasterFileDetailsService.getPAPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[5].id) { // 'B02-20160301-079'
        this.mfDescList = MasterFileDetailsService.getPSURPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[6].id) { // 'B02-20190627-04'
        this.mfDescList = MasterFileDetailsService.getRCPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[7].id) { // 'B02-20190627-03'
        this.mfDescList = MasterFileDetailsService.getPSAPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[8].id) { // 'B02-20190627-05'
        this.mfDescList = MasterFileDetailsService.getREGPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[9].id) { // 'B02-20160301-073'
        this.mfDescList = MasterFileDetailsService.getPRVLDDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[10].id) { // 'B02-20160301-074'
        this.mfDescList = MasterFileDetailsService.getPRVLDADescriptions(this.lang);
      }
    }
    // update reasonArray
    this._updateReasonArray();
    // update reasonResults
    this._updateReasonResults();
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.mfDetailsFormLocalModel = this.mfDetailsFormRecord;
    if (!this.mfDetailsFormLocalModel.pristine) {
      this.mfDetailsFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    MasterFileDetailsService.mapFormModelToDataModel((<FormGroup>this.mfDetailsFormLocalModel),
      this.masterFileModel);
  }

  activityLeadOnblur() {
    if (this.mfDetailsFormLocalModel.controls.activityLead.value) {
      if (this.mfDetailsFormLocalModel.controls.activityLead.value === this.actLeadList[0].id) {
        this.actTypeList = MasterFileDetailsService.getActivityTypeMDBList(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityLead.value === this.actLeadList[1].id) {
        this.actTypeList = MasterFileDetailsService.getActivityTypePVList(this.lang);
      }
    } else {
      this.actTypeList = [];
      this.mfDescList = [];
    }
    this._cleanActivityType();
  }

  activityTypeOnblur() {
    if (this.mfDetailsFormLocalModel.controls.activityType.value) {
      if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[1].id) {
        this.mfDescList = MasterFileDetailsService.getLicenceDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[0].id) { // 'B02-20160301-033'
        this.mfDescList = MasterFileDetailsService.getFaxbackDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[2].id) { // 'B02-20160301-040'
        this.mfDescList = MasterFileDetailsService.getLicenceDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[3].id) { // 'B02-20160301-081'
        this.mfDescList = MasterFileDetailsService.getS36394041Descriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[4].id) { // 'B02-20160621-01'
        this.mfDescList = MasterFileDetailsService.getPAPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[5].id) { // 'B02-20160621-01'
        this.mfDescList = MasterFileDetailsService.getPSURPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[6].id) { // 'B02-20160621-01'
        this.mfDescList = MasterFileDetailsService.getRCPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[7].id) { // 'B02-20160621-01'
        this.mfDescList = MasterFileDetailsService.getPSAPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[8].id) { // 'B02-20160621-01'
        this.mfDescList = MasterFileDetailsService.getREGPVDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[9].id) { // 'B02-20160301-073'
        this.mfDescList = MasterFileDetailsService.getPRVLDDescriptions(this.lang);
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[10].id) { // 'B02-20160301-074'
        this.mfDescList = MasterFileDetailsService.getPRVLDADescriptions(this.lang);
      }
    } else {
      this.mfDescList = [];
    }
    this._cleanActivityDescription();
    this.onblur();
  }

  descrDeviceOnblur() {
    const descValue = this.mfDetailsFormLocalModel.controls.descriptionType.value;
    this._updateReasonArray();
    this._setDescFieldFlags(descValue);
    this._resetReasonValues();
    this.onblur();
  }
  private _cleanActivityType() {
    this.mfDetailsFormLocalModel.controls.activityType.setValue(null);
    this.mfDetailsFormLocalModel.controls.activityType.markAsUntouched();
    this._cleanActivityDescription();
  }
  private _cleanActivityDescription() {
    this.mfDetailsFormLocalModel.controls.descriptionType.setValue(null);
    this.mfDetailsFormLocalModel.controls.descriptionType.markAsUntouched();
    this._setDescFieldFlags(this.mfDetailsFormLocalModel.controls.descriptionType.value);
    this._cleanDeviceClass();
    this._cleanOthers();
  }
  private _cleanDeviceClass() {
    this.mfDetailsFormLocalModel.controls.deviceClass.setValue(null);
    this.mfDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
  }
  private _cleanOthers() {
    this._resetReasonValues();
  }
  isSolicitedOnblur() {
    this.isSolicitedFlag.emit(this.mfDetailsFormLocalModel.controls.isSolicitedInfo.value === GlobalsService.YES);
    this.onblur();
  }
  onOrgManufactureLicblur() {
    if (this.mfDetailsFormLocalModel.controls.orgManufactureLic.value
        && this.mfDetailsFormLocalModel.controls.orgManufactureLic.value.toString().length < 6) {
      this.mfDetailsFormLocalModel.controls.orgManufactureLic.setValue(
        ('000000' + this.mfDetailsFormLocalModel.controls.orgManufactureLic.value )
          .slice(this.mfDetailsFormLocalModel.controls.orgManufactureLic.value.toString().length) );
    }
    this.onblur();
  }
  // reasonArray is the flags to display the reason chexk box list
  private _updateReasonArray() {
    const descValue = this.mfDetailsFormLocalModel.controls.descriptionType.value;
    if (this.mfDetailsFormLocalModel.controls.activityType.value !== this.rawActTypes[1].id
      && this.mfDetailsFormLocalModel.controls.activityType.value !== this.rawActTypes[9].id
      && descValue === this.rawDescTypes[this.rawDescMap.indexOf('i5')].id &&
      this.mfDetailsFormLocalModel.controls.deviceClass.value) {
      if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[2].id ) { // 'B02-20160301-040'
        switch (this.mfDetailsFormLocalModel.controls.deviceClass.value) {
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

      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[0].id ) { // 'B02-20160301-033'
        this.reasonArray = [false, true, true, false, false, false, false, false, false, false, true];
      } else if (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[10].id ) { // 'B02-20160301-033'
        this.reasonArray = [true, true, true, false, false, false, false, false, false, true, true];
      }
    } else {
      this.reasonArray = [false, false, false, false, false, false, false, false, false, false, false];
    }
  }

  private _setDescFieldFlags(descValue) {
    this.showBriefDesc = (descValue === this.rawDescTypes[this.rawDescMap.indexOf('i25')].id) ? true : false;
    this.showDate =  (descValue === this.rawDescTypes[this.rawDescMap.indexOf('i0')].id ||  descValue === this.rawDescTypes[this.rawDescMap.indexOf('i2')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i3')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i4')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i6')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i9')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i11')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i14')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i15')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i16')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i17')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i18')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i19')].id || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i20')].id
      || descValue === this.rawDescTypes[this.rawDescMap.indexOf('i21')].id) ? true : false;
    this.showVersion = (descValue === this.rawDescTypes[2].id || descValue === this.rawDescTypes[21].id) ? true : false;
    // this.showRationalRequired = (
    //   (this.rawDescTypes[9].id === this.mfDetailsFormLocalModel.controls.descriptionType.value) &&
    //   (this.rawActTypes[0].id === this.mfDetailsFormLocalModel.controls.activityType.value
    //     || (this.rawActTypes[2].id === this.mfDetailsFormLocalModel.controls.activityType.value && (
    //         this.mfDetailsFormLocalModel.controls.classChange.value ||
    //         this.mfDetailsFormLocalModel.controls.licenceChange.value ||
    //         this.mfDetailsFormLocalModel.controls.deviceChange.value ||
    //         this.mfDetailsFormLocalModel.controls.addChange.value
    //       ))
    //     )) ? true : false;
    this.showPeriod = descValue === this.rawDescTypes[this.rawDescMap.indexOf('i3')].id ? true : false;
  }

  private _resetReasonValues() {
    this.reasonResults = [false, false, false, false, false, false, false, false, false, false, false];
    this.mfDetailsFormLocalModel.controls.amendReason.setValue(null);
    this.mfDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.classChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.classChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.licenceChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.licenceChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.deviceChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.deviceChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.processChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.processChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.qualityChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.qualityChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.designChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.designChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.materialsChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.materialsChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.labellingChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.labellingChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.safetyChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.safetyChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.purposeChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.purposeChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.addChange.setValue(false);
    this.mfDetailsFormLocalModel.controls.addChange.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.licenceNum.setValue(null);
    this.mfDetailsFormLocalModel.controls.licenceNum.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.orgManufactureId.setValue(null);
    this.mfDetailsFormLocalModel.controls.orgManufactureId.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.orgManufactureLic.setValue(null);
    this.mfDetailsFormLocalModel.controls.orgManufactureLic.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.appNum.setValue(null);
    this.mfDetailsFormLocalModel.controls.appNum.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.deviceName.setValue(null);
    this.mfDetailsFormLocalModel.controls.deviceName.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.requestDate.setValue(null);
    this.mfDetailsFormLocalModel.controls.requestDate.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.briefDesc.setValue(null);
    this.mfDetailsFormLocalModel.controls.briefDesc.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.rationale.setValue(null);
    this.mfDetailsFormLocalModel.controls.rationale.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.proposedIndication.setValue(null);
    this.mfDetailsFormLocalModel.controls.proposedIndication.markAsUntouched();
    this.mfDetailsFormLocalModel.controls.requestTo.setValue(null);
    this.mfDetailsFormLocalModel.controls.requestTo.markAsUntouched();
  }

  reasonOnblur(int) {
    let itemValue = false;
    switch (int) {
      case 0:
        itemValue = this.mfDetailsFormLocalModel.controls.classChange.value;
        break;
      case 1:
        itemValue = this.mfDetailsFormLocalModel.controls.licenceChange.value;
        break;
      case 2:
        itemValue = this.mfDetailsFormLocalModel.controls.deviceChange.value;
        break;
      case 3:
        itemValue = this.mfDetailsFormLocalModel.controls.processChange.value;
        break;
      case 4:
        itemValue = this.mfDetailsFormLocalModel.controls.qualityChange.value;
        break;
      case 5:
        itemValue = this.mfDetailsFormLocalModel.controls.designChange.value;
        break;
      case 6:
        itemValue = this.mfDetailsFormLocalModel.controls.materialsChange.value;
        break;
      case 7:
        itemValue = this.mfDetailsFormLocalModel.controls.labellingChange.value;
        break;
      case 8:
        itemValue = this.mfDetailsFormLocalModel.controls.safetyChange.value;
        break;
      case 9:
        itemValue = this.mfDetailsFormLocalModel.controls.purposeChange.value;
        break;
      case 10:
        itemValue = this.mfDetailsFormLocalModel.controls.addChange.value;
        break;
    }
    if (itemValue) {
      this.mfDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
      this.reasonResults[int] = true;
    } else {
      this.reasonResults[int] = false;
      this._resetReasonFlag();
    }
    // this.showRationalRequired = (
    //   (this.rawDescTypes[9].id === this.mfDetailsFormLocalModel.controls.descriptionType.value) &&
    //   (this.rawActTypes[2].id === this.mfDetailsFormLocalModel.controls.activityType.value && (
    //       this.mfDetailsFormLocalModel.controls.classChange.value ||
    //       this.mfDetailsFormLocalModel.controls.licenceChange.value ||
    //       this.mfDetailsFormLocalModel.controls.deviceChange.value ||
    //       this.mfDetailsFormLocalModel.controls.addChange.value
    //     ))
    //   ) ? true : false;
    // this.showProposeIndication =  (this.rawDescTypes[9].id === this.mfDetailsFormLocalModel.controls.descriptionType.value &&
    //   this.rawActTypes[2].id === this.mfDetailsFormLocalModel.controls.activityType.value &&
    //   this.devClassList[0].id === this.mfDetailsFormLocalModel.controls.deviceClass.value &&
    //   this.mfDetailsFormLocalModel.controls.purposeChange.value
    //   ) ? true : false;
    this.onblur();
  }
  showRationaleRequired() {
    if ((this.rawDescTypes[this.rawDescMap.indexOf('i5')].id === this.mfDetailsFormLocalModel.controls.descriptionType.value &&
      this.mfDetailsFormLocalModel.controls.deviceClass.value ) && (this.rawActTypes[0].id === this.mfDetailsFormLocalModel.controls.activityType.value ||
      (this.rawActTypes[2].id === this.mfDetailsFormLocalModel.controls.activityType.value && (
        this.mfDetailsFormLocalModel.controls.classChange.value ||
        this.mfDetailsFormLocalModel.controls.licenceChange.value ||
        this.mfDetailsFormLocalModel.controls.deviceChange.value ||
        this.mfDetailsFormLocalModel.controls.addChange.value
      )))) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.rationale.setValue(null);
      this.mfDetailsFormLocalModel.controls.rationale.markAsUntouched();
    }
    return false;
  }
  showProposeIndication() {
    if (this.rawDescTypes[this.rawDescMap.indexOf('i5')].id === this.mfDetailsFormLocalModel.controls.descriptionType.value &&
      this.rawActTypes[2].id === this.mfDetailsFormLocalModel.controls.activityType.value &&
      this.devClassList[0].id === this.mfDetailsFormLocalModel.controls.deviceClass.value &&
      this.mfDetailsFormLocalModel.controls.purposeChange.value) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.proposedIndication.setValue(null);
      this.mfDetailsFormLocalModel.controls.proposedIndication.markAsUntouched();
    }
    return false;
  }

  licenceNumOnblur() {
    if (this.mfDetailsFormLocalModel.controls.licenceNum.value && !isNaN(this.mfDetailsFormLocalModel.controls.licenceNum.value)) {
      const lnum = '000000' + this.mfDetailsFormLocalModel.controls.licenceNum.value;
      this.mfDetailsFormLocalModel.controls.licenceNum.setValue(lnum.substring(lnum.length - 6));
    }
    this.onblur();
  }

  private _resetReasonFlag() {
    this.mfDetailsFormLocalModel.controls.amendReason.setValue(null);
    for (const reason of this.reasonResults){
      if (reason) {
        this.mfDetailsFormLocalModel.controls.amendReason.setValue('reasonFilled');
        break;
      }
    }
  }

  // set reason result after load data
  private _updateReasonResults() {
    this.reasonResults[0] = this.mfDetailsFormLocalModel.controls.classChange.value;
    this.reasonResults[1] = this.mfDetailsFormLocalModel.controls.licenceChange.value;
    this.reasonResults[2] = this.mfDetailsFormLocalModel.controls.deviceChange.value;
    this.reasonResults[3] = this.mfDetailsFormLocalModel.controls.processChange.value;
    this.reasonResults[4] = this.mfDetailsFormLocalModel.controls.qualityChange.value;
    this.reasonResults[5] = this.mfDetailsFormLocalModel.controls.designChange.value;
    this.reasonResults[6] = this.mfDetailsFormLocalModel.controls.materialsChange.value;
    this.reasonResults[7] = this.mfDetailsFormLocalModel.controls.labellingChange.value;
    this.reasonResults[8] = this.mfDetailsFormLocalModel.controls.safetyChange.value;
    this.reasonResults[9] = this.mfDetailsFormLocalModel.controls.purposeChange.value;
    this.reasonResults[10] = this.mfDetailsFormLocalModel.controls.addChange.value;
  }

  isInitial() {
    return (this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i5')].id);
  }

  isLicence() {
    return (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[1].id
      || this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[9].id);
  }

  isClassSet() {
    return (this.mfDetailsFormLocalModel.controls.deviceClass.value);
  }

  isNotInitial() {
    return (this.mfDetailsFormLocalModel.controls.descriptionType.value && !this.isInitial());
  }

  isDescInitial() {
    if (this.isInitial()) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.deviceClass.setValue(null);
      this.mfDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
      this.mfDetailsFormLocalModel.controls.amendReason.setValue(null);
      this.mfDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    }
    return false;
  }

  // isInitialNotLicence() {
  //   if (this.isInitial() && this.mfDetailsFormLocalModel.controls.activityType.value && !this.isLicence()) {
  //       return true;
  //   } else {
  //     this.mfDetailsFormLocalModel.controls.deviceClass.setValue(null);
  //     this.mfDetailsFormLocalModel.controls.deviceClass.markAsUntouched();
  //     this.mfDetailsFormLocalModel.controls.amendReason.setValue(null);
  //     this.mfDetailsFormLocalModel.controls.amendReason.markAsUntouched();
  //   }
  //   return false;
  // }

  isInitialNotLicenceDCSet() {
    if (this.isInitial() && !this.isLicence() && this.isClassSet()) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.amendReason.setValue(null);
      this.mfDetailsFormLocalModel.controls.amendReason.markAsUntouched();
    }
    return false;
  }

  isInitialAndLicence() {
    if (this.isInitial() && this.isLicence()) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.deviceName.setValue(null);
      this.mfDetailsFormLocalModel.controls.deviceName.markAsUntouched();
    }
    return false;
  }

  isNotUnsolicited() {
    if (this.mfDetailsFormLocalModel.controls.descriptionType.value !== this.rawDescTypes[this.rawDescMap.indexOf('i25')].id) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.isSolicitedInfo.setValue(null);
      this.mfDetailsFormLocalModel.controls.isSolicitedInfo.markAsUntouched();
      this.isSolicitedFlag.emit(false);
    }
    return false;
  }

  isNotInitialMmUd() {
    if (this.isNotInitial() && (
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i1')].id ||
          this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i7')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i14')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i15')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i20')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i26')].id
      )) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.appNum.setValue(null);
      this.mfDetailsFormLocalModel.controls.appNum.markAsUntouched();
    }
    return false;
  }

  isMmUd() {
    if (this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i8')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i9')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i10')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i18')].id ||
      this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i19')].id ) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.appNumOpt.setValue(null);
      this.mfDetailsFormLocalModel.controls.appNumOpt.markAsUntouched();
    }
    return false;
  }

  isHasDdtMandatory() {
    if (this.isInitialAndLicence() || this.mfDetailsFormLocalModel.controls.deviceChange.value) {
      this.mfDetailsFormLocalModel.controls.hasDdt.setValue(null);
      this.mfDetailsFormLocalModel.controls.hasDdt.markAsUntouched();
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.hasDdtMan.setValue(null);
      this.mfDetailsFormLocalModel.controls.hasDdtMan.markAsUntouched();
    }
    return false;
  }

  isLicenceNameChanged() {
    if (this.mfDetailsFormLocalModel.controls.licenceChange.value) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.licenceName.setValue(null);
      this.mfDetailsFormLocalModel.controls.licenceName.markAsUntouched();
    }
    return false;
  }

  isDeviceNameChanged() {
    return (this.mfDetailsFormLocalModel.controls.deviceChange.value);
  }

  isMm() {
    if (this.mfDetailsFormLocalModel.controls.descriptionType.value === this.rawDescTypes[this.rawDescMap.indexOf('i9')].id) {
      return true;
    } else {
      this.mfDetailsFormLocalModel.controls.meetingId.setValue(null);
      this.mfDetailsFormLocalModel.controls.meetingId.markAsUntouched();
    }
    return false;
  }

  getReasonArrayVelue(index) {
    return this.reasonArray[index];
  }

  showOrgManufactureId() {
    if (this.mfDetailsFormLocalModel.controls.descriptionType.value
        && this.mfDetailsFormLocalModel.controls.descriptionType.value !== this.rawDescTypes[this.rawDescMap.indexOf('i26')].id
        && (this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[9].id
            || this.mfDetailsFormLocalModel.controls.activityType.value === this.rawActTypes[10].id
            )
      ) {
      return true;
    }
    return false;
  }
  showOrgManufactureLic() {
    return this.showOrgManufactureId();
  }
}

