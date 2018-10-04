import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {ApplicationInfoService} from './application.info.service';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';


@Component({
  selector: 'application-info',
  templateUrl: 'application.info.component.html'
})

/**
 *  Application Info Component is used for Company Form
 */
export class ApplicationInfoComponent implements OnInit, OnChanges, AfterViewInit {

  public applicationInfoFormLocalModel: FormGroup;
  @Input('group') public applicationInfoFormRecord: FormGroup;
  @Input() appInfoModel;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() inComplete: boolean;
  @Input() isInternal: boolean;
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public isAmend = true;
  public showFieldErrors: boolean;
  public setAsComplete = true;
  private detailsService: ApplicationInfoService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    // this.showErrors = false;
    this.detailsService = new ApplicationInfoService();
  }

  ngOnInit() {
    if (!this.applicationInfoFormLocalModel) {
      this.applicationInfoFormLocalModel = ApplicationInfoService.getReactiveModel(this._fb);
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
      if (this.applicationInfoFormRecord) {
        this.setToLocalModel();

      } else {
        this.applicationInfoFormLocalModel = ApplicationInfoService.getReactiveModel(this._fb);
        this.applicationInfoFormLocalModel.markAsPristine();
      }
      if (this.applicationInfoFormLocalModel ) {
        ApplicationInfoService.mapFormModelToDataModel((<FormGroup>this.applicationInfoFormLocalModel),
          this.appInfoModel);
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
    if (changes['inComplete']) {
      this.setAsComplete = changes['inComplete'].currentValue && this.isInternal;
    }
    if (changes['appInfoModel']) {
      const dataModel = changes['appInfoModel'].currentValue;
      ApplicationInfoService.mapDataModelToFormModel(dataModel,
        (<FormGroup>this.applicationInfoFormLocalModel));
      // this.validRec = true; todo: valid record ???
    }

  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.applicationInfoFormLocalModel = this.applicationInfoFormRecord;
    if (!this.applicationInfoFormLocalModel.pristine) {
      this.applicationInfoFormLocalModel.markAsPristine();
    }
  }

  removed(rec) {
    console.log(rec);
  }

  showAmendMsg() {

    if (!this.applicationInfoFormLocalModel) {
      return false;
    }
    return this.applicationInfoFormLocalModel.controls.formStatus.value === GlobalsService.AMEND;
  }

  disableAmend () {
    return !this.isInternal;
  }

  public setAmendState () {
    this.isAmend = true;
    this.appInfoModel.status = ApplicationInfoService.setAmendStatus();
    ApplicationInfoService.mapDataModelToFormModel(this.appInfoModel,
      (<FormGroup>this.applicationInfoFormLocalModel));
  }

  onblur() {
    // console.log('input is typed');
    ApplicationInfoService.mapFormModelToDataModel((<FormGroup>this.applicationInfoFormLocalModel),
      this.appInfoModel);
  }

  // typed(rec) {
  //   var content = rec.replace(/[\x00-\x7F]/g, '', '');
  //   console.log('this is typed');
  //   if (content && this.existsInList(content)) {
  //     this.applicationInfoFormLocalModel.controls.country.setValue([content]);
  //   }
  // }
  //
  // existsInList(rec) {
  //   for (let country of this.countries) {
  //     if (country.id == rec) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // private _setPostalPattern(countryValue) {
  //   //  console.log("starting the postal Pattern");
  //   // this.postalPattern=
  //   if (ApplicationInfoService.isCanada(countryValue)) {
  //
  //     this.postalLabel = 'postal.canada';
  //     this.provinceLabel = 'applicationInfo.province';
  //     this.postalPattern = /^(?!.*[DFIOQU])[A-VXYa-vxy][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;
  //   } else if (ApplicationInfoService.isUsa(countryValue)) {
  //     this.postalPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
  //     this.postalLabel = 'postal.usa';
  //     //  console.log("This is the postal label"+this.postalLabel);
  //     this.provinceLabel = 'applicationInfo.state';
  //   } else {
  //     this.postalPattern = null;
  //   }
  // }
}

