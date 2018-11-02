import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {ApplicationInfoDetailsService} from './application-info.details.service';
// todo: add its own dataloader ?
// import {??DataLoaderService} from '../data-loader/??-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';


@Component({
  selector: 'app-info-details',
  templateUrl: 'application-info.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class ApplicationInfoDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public appInfoFormLocalModel: FormGroup;
  @Input('group') public appInfoFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() countryList;
  @Input() appInfoModel;
  @Input() deviceModel;
  @Input() materialModel;
  @Input() lang;
  // @Output() hasQmsc = new EventEmitter();
  @Output() detailErrorList = new EventEmitter(true);
  @Output() deviceErrorList = new EventEmitter(true);
  @Output() materialErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public drugTypeList = [];
  public deviceClassList: Array<any> = [];
  public yesNoList: Array<any> = [];
  public licenceAppTypeList: Array<any> = [];
  public showFieldErrors = false;
  private detailsService: ApplicationInfoDetailsService;

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    // todo: dataLoader = new DossierDataLoaderService(this.http);
    this.showFieldErrors = false;
    this.showErrors = false;
    this.drugTypeList = [];
    this.detailsService = new ApplicationInfoDetailsService();
    // this.deviceClassList = this.detailsService.getDeviceClassList();
    this.yesNoList = this.detailsService.getYesNoList();
  }

  async ngOnInit() {
    if (!this.appInfoFormLocalModel) {
      this.appInfoFormLocalModel = this.detailsService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;
    this.drugTypeList = ApplicationInfoDetailsService.getDrugTypes();
    this.licenceAppTypeList = ApplicationInfoDetailsService.getLicenceAppTypeList(this.lang); // todo: test which lang is working
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
      if (this.appInfoFormRecord) {
        this.setToLocalModel();

      } else {
        this.appInfoFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.appInfoFormLocalModel.markAsPristine();
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
    if (changes['deviceClassList']) {
      this.deviceClassList = changes['deviceClassList'].currentValue;
    }
    if (changes['appInfoFormLocalModel']) {
      console.log('**********the DOSSIER details changed');
      this.appInfoFormRecord = this.appInfoFormLocalModel;
    }
    if (changes['appInfoModel']) {
      const dataModel = changes['appInfoModel'].currentValue;
      if (!this.appInfoFormLocalModel) {
        this.appInfoFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.appInfoFormLocalModel.markAsPristine();
      }
      ApplicationInfoDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.appInfoFormLocalModel));
      // emit hasQMSC value
      // if (this.appInfoFormLocalModel.controls.hasQMSC) {
      //   this.hasQmsc.emit(this.appInfoFormLocalModel.controls.hasQMSC.value);
      // }
    }
    if (changes['lang']) {
      const language = changes['lang'].currentValue;
      if (language === GlobalsService.ENGLISH) {
        // this.appInfoFormLocalModel.controls.appInfoType.setValue(GlobalsService.DEVICE_TYPE_EN);
      } else if (language === GlobalsService.FRENCH) {
        // this.appInfoFormLocalModel.controls.appInfoType.setValue(GlobalsService.DEVICE_TYPE_FR);
      }
      ApplicationInfoDetailsService.mapFormModelToDataModel((<FormGroup>this.appInfoFormLocalModel),
        this.appInfoModel);
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.appInfoFormLocalModel = this.appInfoFormRecord;
    if (!this.appInfoFormLocalModel.pristine) {
      this.appInfoFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    ApplicationInfoDetailsService.mapFormModelToDataModel((<FormGroup>this.appInfoFormLocalModel),
      this.appInfoModel);
    // if (this.appInfoFormLocalModel.controls.hasQMSC) {
    //   this.hasQmsc.emit(this.appInfoFormLocalModel.controls.hasQMSC.value);
    // }
  }

  isQmsc() {
    const iscert = this.appInfoFormLocalModel.controls.hasQMSC.value;
    return (iscert && iscert === GlobalsService.YES);
  }

  processDeviceErrors(errorList) {
    this.deviceErrorList.emit(errorList);

  }

  processMaterialErrors(errorList) {
    this.materialErrorList.emit(errorList);
  }

  isIVDD() {
    if (this.appInfoFormLocalModel.controls.isIvdd.value) {
      return (this.appInfoFormLocalModel.controls.isIvdd.value === GlobalsService.YES);
    }
    return false;
  }

  isNOIVDD() {
    if (this.appInfoFormLocalModel.controls.isIvdd.value) {
      return (this.appInfoFormLocalModel.controls.isIvdd.value === GlobalsService.NO);
    }
    return false;
  }

  hasDrug() {
    if (this.appInfoFormLocalModel.controls.hasDrug.value) {
      return (this.appInfoFormLocalModel.controls.hasDrug.value === GlobalsService.YES);
    }
    return false;
  }

  hasDin() {
    if (this.appInfoFormLocalModel.controls.hasDinNpn.value) {
      return (this.appInfoFormLocalModel.controls.hasDinNpn.value === 'din');
    }
    return false;
  }

  hasNpn() {
    if (this.appInfoFormLocalModel.controls.hasDinNpn.value) {
      return (this.appInfoFormLocalModel.controls.hasDinNpn.value === 'npn');
    }
    return false;
  }

  isNoDinNpn() {
    if (this.appInfoFormLocalModel.controls.hasDinNpn.value) {
      return (this.appInfoFormLocalModel.controls.hasDinNpn.value === 'nodinnpn');
    }
    return false;
  }

  isOtherPharmacopeia() {
      return this.appInfoFormLocalModel.controls.complianceOther.value;
  }

  isIt() {
      return this.appInfoFormLocalModel.controls.provisionMdrIT.value;
  }

  isSa() {
      return this.appInfoFormLocalModel.controls.provisionMdrSA.value;
  }

  isNoDeclaration() {
    if (this.appInfoFormLocalModel.controls.declarationConformity.value) {
      return (this.appInfoFormLocalModel.controls.declarationConformity.value === GlobalsService.NO);
    }
    return false;
  }

  isRecombinant() {
    if (this.appInfoFormLocalModel.controls.hasRecombinant.value) {
      return (this.appInfoFormLocalModel.controls.hasRecombinant.value === GlobalsService.YES);
    }
    return false;
  }

  isAnimalHumanSourced() {
    if (this.appInfoFormLocalModel.controls.isAnimalHumanSourced.value) {
      return (this.appInfoFormLocalModel.controls.isAnimalHumanSourced.value === GlobalsService.YES);
    }
    return false;
  }

  isListedIddTable() {
    if (this.appInfoFormLocalModel.controls.isListedIddTable.value) {
      return (this.appInfoFormLocalModel.controls.isListedIddTable.value === GlobalsService.YES);
    }
    return false;
  }
}

