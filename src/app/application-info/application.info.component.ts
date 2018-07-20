import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {ApplicationInfoService} from './application.info.service';
import {isArray} from 'util';


@Component({
  selector: 'application-info',
  templateUrl: 'application.info.component.html'
})

/**
 * Sample component is used for nothing
 */
export class ApplicationInfoComponent implements OnInit, OnChanges, AfterViewInit {

  public applicationInfoFormLocalModel: FormGroup;
  @Input('group') public applicationInfoFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() inComplete: boolean;
  @Input() isInternal: boolean; // todo: control if this is internal site ???
  @Output() errorList = new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public statusList: Array<any> = [];
  public isAmend: boolean = true;
  public showFieldErrors: boolean = false;
  public setAsIncomplete = true;
  private detailsService: ApplicationInfoService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.detailsService = new ApplicationInfoService();
    this.statusList = this.detailsService.statusList;
  }

  ngOnInit() {
    if (!this.applicationInfoFormLocalModel) {
      this.applicationInfoFormLocalModel = ApplicationInfoService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;

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

    //since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { //used as a change indicator for the model
      // console.log("the details cbange");
      if (this.applicationInfoFormRecord) {
        this.setToLocalModel();

      } else {
        this.applicationInfoFormLocalModel = ApplicationInfoService.getReactiveModel(this._fb);
        this.applicationInfoFormLocalModel.markAsPristine();
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
      this.setAsIncomplete = changes['inComplete'].currentValue && this.isInternal;
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
    return this.applicationInfoFormLocalModel.status === 'AMEND';
  }

  disableAmend () {
    return !this.isInternal;
  }

  public setAmendState () {
    this.isAmend = true;
  }

  // typed(rec) {
  //   var content = rec.replace(/[\x00-\x7F]/g, '', '');
  //   console.log('this is typed');
  //   if (content && this.existsInList(content)) {
  //     this.applicationInfoFormLocalModel.controls.country.setValue([content]);
  //   }
  // }
  //
  // onblur() {
  //   console.log(' BLRRE$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  //
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

