import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {DossierAppInfoService} from './dossier.info.service';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';


@Component({
  selector: 'dossier-app-info',
  templateUrl: 'dossier.info.component.html'
})

/**
 *  Application Info Component is used for Company Form
 */
export class DossierApplInfoComponent implements OnInit, OnChanges, AfterViewInit {

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
  private detailsService: DossierAppInfoService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    // this.showErrors = false;
    this.detailsService = new DossierAppInfoService();
  }

  ngOnInit() {
    if (!this.applicationInfoFormLocalModel) {
      this.applicationInfoFormLocalModel = DossierAppInfoService.getReactiveModel(this._fb);
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
      if (this.applicationInfoFormRecord) {
        this.setToLocalModel();

      } else {
        this.applicationInfoFormLocalModel = DossierAppInfoService.getReactiveModel(this._fb);
        this.applicationInfoFormLocalModel.markAsPristine();
      }
      if (this.applicationInfoFormLocalModel ) {
        DossierAppInfoService.mapFormModelToDataModel((<FormGroup>this.applicationInfoFormLocalModel),
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
      DossierAppInfoService.mapDataModelToFormModel(dataModel,
        (<FormGroup>this.applicationInfoFormLocalModel));
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

  isInternalSite () {
    return this.isInternal;
  }

  onblur() {
    // console.log('input is typed');
    DossierAppInfoService.mapFormModelToDataModel((<FormGroup>this.applicationInfoFormLocalModel),
      this.appInfoModel);
  }
}

