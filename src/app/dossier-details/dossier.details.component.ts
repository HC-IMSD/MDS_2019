import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {DossierDetailsService} from './dossier.details.service';
import {DossierDataLoaderService} from '../data-loader/dossier-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';


@Component({
  selector: 'dossier-details',
  templateUrl: 'dossier.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class DossierDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public dossierFormLocalModel: FormGroup;
  @Input('group') public dossierFormRecord: FormGroup;
  // @Input() public addressDetailsModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() dossierModel;
  @Input() lang;
  @Output() hasQmsc = new EventEmitter();
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public registrarList = [];
  public deviceClassList: Array<any> = [];
  public yesNoList: Array<any> = [];
  public licenceAppTypeList: Array<any> = [];
  public showFieldErrors = false;
  private detailsService: DossierDetailsService;

  constructor(private _fb: FormBuilder, private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    dataLoader = new DossierDataLoaderService(this.http);
    this.showFieldErrors = false;
    this.showErrors = false;
    this.registrarList = [];
    this.detailsService = new DossierDetailsService();
    this.deviceClassList = this.detailsService.getDeviceClassList();
    this.yesNoList = this.detailsService.getYesNoList();
  }

  async ngOnInit() {
    if (!this.dossierFormLocalModel) {
      this.dossierFormLocalModel = this.detailsService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;
    this.registrarList = await (this.dataLoader.getRegistrars(this.translate.currentLang));
    this.licenceAppTypeList = DossierDetailsService.getLicenceAppTypeList(this.lang); // todo: test which lang is working
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
    this.errorList.emit(temp);

  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.dossierFormRecord) {
        this.setToLocalModel();

      } else {
        this.dossierFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.dossierFormLocalModel.markAsPristine();
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
    if (changes['deviceClassList']) {
      this.deviceClassList = changes['deviceClassList'].currentValue;
    }
    if (changes['dossierFormLocalModel']) {
      console.log('**********the DOSSIER details changed');
      this.dossierFormRecord = this.dossierFormLocalModel;
    }
    if (changes['dossierModel']) {
      const dataModel = changes['dossierModel'].currentValue;
      if (!this.dossierFormLocalModel) {
        this.dossierFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.dossierFormLocalModel.markAsPristine();
      }
      DossierDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.dossierFormLocalModel),
        this.registrarList);
      // emit hasQMSC value
      if (this.dossierFormLocalModel.controls.hasQMSC) {
        this.hasQmsc.emit(this.dossierFormLocalModel.controls.hasQMSC.value);
      }
    }
    if (changes['lang']) {
      const language = changes['lang'].currentValue;
      if (language === GlobalsService.ENGLISH) {
        this.dossierFormLocalModel.controls.dossierType.setValue(GlobalsService.DEVICE_TYPE_EN);
      } else if (language === GlobalsService.FRENCH) {
        this.dossierFormLocalModel.controls.dossierType.setValue(GlobalsService.DEVICE_TYPE_FR);
      }
      DossierDetailsService.mapFormModelToDataModel((<FormGroup>this.dossierFormLocalModel),
        this.dossierModel, this.registrarList);
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.dossierFormLocalModel = this.dossierFormRecord;
    if (!this.dossierFormLocalModel.pristine) {
      this.dossierFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    DossierDetailsService.mapFormModelToDataModel((<FormGroup>this.dossierFormLocalModel),
      this.dossierModel, this.registrarList);
    if (this.dossierFormLocalModel.controls.hasQMSC) {
      this.hasQmsc.emit(this.dossierFormLocalModel.controls.hasQMSC.value);
    }
  }

  existsInList(rec) {
    for (let registrar of this.registrarList) {
      if (registrar.id === rec) {
        return true;
      }
    }
    return false;
  }

  isQmsc() {
    const iscert = this.dossierFormLocalModel.controls.hasQMSC.value;
    return (iscert && iscert === GlobalsService.YES);
  }
}

