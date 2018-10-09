import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {CompanyInfoService} from './company.info.service';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';


@Component({
  selector: 'com-gen-info',
  templateUrl: 'company.info.component.html'
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
  @Input() inComplete: boolean;
  @Input() isInternal: boolean;
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public isAmend = true;
  public showFieldErrors: boolean;
  public setAsComplete = true;
  private detailsService: CompanyInfoService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    // this.showErrors = false;
    this.detailsService = new CompanyInfoService();
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
    if (changes['inComplete']) {
      this.setAsComplete = changes['inComplete'].currentValue && this.isInternal;
    }
    if (changes['genInfoModel']) {
      const dataModel = changes['genInfoModel'].currentValue;
      CompanyInfoService.mapDataModelToFormModel(dataModel,
        (<FormGroup>this.generalInfoFormLocalModel));
      // this.validRec = true; todo: valid record ???
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

  showAmendMsg() {

    if (!this.generalInfoFormLocalModel) {
      return false;
    }
    return this.generalInfoFormLocalModel.controls.formStatus.value === GlobalsService.AMEND;
  }

  disableAmend () {
    return !this.isInternal;
  }

  public setAmendState () {
    this.isAmend = true;
    this.genInfoModel.status = CompanyInfoService.setAmendStatus();
    CompanyInfoService.mapDataModelToFormModel(this.genInfoModel,
      (<FormGroup>this.generalInfoFormLocalModel));
  }

  onblur() {
    // console.log('input is typed');
    CompanyInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel),
      this.genInfoModel);
  }

  // typed(rec) {
  //   var content = rec.replace(/[\x00-\x7F]/g, '', '');
  //   console.log('this is typed');
  //   if (content && this.existsInList(content)) {
  //     this.generalInfoFormLocalModel.controls.country.setValue([content]);
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
  //   if (CompanyInfoService.isCanada(countryValue)) {
  //
  //     this.postalLabel = 'postal.canada';
  //     this.provinceLabel = 'generalInfo.province';
  //     this.postalPattern = /^(?!.*[DFIOQU])[A-VXYa-vxy][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;
  //   } else if (CompanyInfoService.isUsa(countryValue)) {
  //     this.postalPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
  //     this.postalLabel = 'postal.usa';
  //     //  console.log("This is the postal label"+this.postalLabel);
  //     this.provinceLabel = 'generalInfo.state';
  //   } else {
  //     this.postalPattern = null;
  //   }
  // }
}

