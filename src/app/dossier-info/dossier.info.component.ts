import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {DossierGenInfoService} from './dossier.info.service';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';


@Component({
  selector: 'dos-gen-info',
  templateUrl: 'dossier.info.component.html'
})

/**
 *  Application Info Component is used for Company Form
 */
export class DossierInfoComponent implements OnInit, OnChanges, AfterViewInit {

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
  private detailsService: DossierGenInfoService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    // this.showErrors = false;
    this.detailsService = new DossierGenInfoService();
  }

  ngOnInit() {
    if (!this.generalInfoFormLocalModel) {
      this.generalInfoFormLocalModel = DossierGenInfoService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;
    console.log('this.isInternal: ' + this.isInternal);
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
      if (this.generalInfoFormRecord) {
        this.setToLocalModel();

      } else {
        this.generalInfoFormLocalModel = DossierGenInfoService.getReactiveModel(this._fb);
        this.generalInfoFormLocalModel.markAsPristine();
      }
      if (this.generalInfoFormLocalModel ) {
        DossierGenInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel),
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
      DossierGenInfoService.mapDataModelToFormModel(dataModel,
        (<FormGroup>this.generalInfoFormLocalModel));
    }
    if (changes['isInternal']) {
      if (!changes['isInternal'].currentValue) {
        this.setAsComplete = (this.genInfoModel.status === GlobalsService.FINAL && !changes['isInternal'].currentValue);
      } // && this.isInternal;
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

  isInternalSite () {
    return this.isInternal;
  }

  onblur() {
    // console.log('input is typed');
    DossierGenInfoService.mapFormModelToDataModel((<FormGroup>this.generalInfoFormLocalModel),
      this.genInfoModel);
  }
}

