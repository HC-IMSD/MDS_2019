import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {MasterFileFeeService} from './master-file.fee.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../globals/globals.service';
import {ListService} from '../list-service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';


@Component({
  selector: 'master-file-fee',
  templateUrl: 'master-file.fee.component.html',
  encapsulation: ViewEncapsulation.None

})

/**
 * Sample component is used for nothing
 */
export class MasterFileFeeComponent implements OnInit, OnChanges, AfterViewInit {

  public transFeeFormLocalModel: FormGroup;
  @Input('group') public transFeeFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() transFeeModel;
  @Input() lang;
  @Output() feeErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public yesNoList: Array<any> = [];
  public showFieldErrors = false;
  private feeService: MasterFileFeeService;

  constructor(private _fb: FormBuilder,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.feeService = new MasterFileFeeService();
    this.yesNoList = this.feeService.getYesNoList();
  }

  async ngOnInit() {
    if (!this.transFeeFormLocalModel) {
      this.transFeeFormLocalModel = this.feeService.getReactiveModel(this._fb);
    }
    // if (!this.transFeeModel) {
    //   this.transFeeModel = this.feeService.getEmptyModel();
    // }
    this.detailsChanged = 0;
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
    this.feeErrorList.emit(temp);

  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.transFeeFormRecord) {
        this.setToLocalModel();

      } else {
        this.transFeeFormLocalModel = this.feeService.getReactiveModel(this._fb);
        this.transFeeFormLocalModel.markAsPristine();
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
      this.feeErrorList.emit(temp);
    }
    if (changes['transFeeFormLocalModel']) {
      console.log('**********the Master File fees changed');
      this.transFeeFormRecord = this.transFeeFormLocalModel;
    }
    if (changes['transFeeModel']) {
      const dataModel = changes['transFeeModel'].currentValue;
      if (!this.transFeeFormLocalModel) {
        this.transFeeFormLocalModel = this.feeService.getReactiveModel(this._fb);
        this.transFeeFormLocalModel.markAsPristine();
      }
      MasterFileFeeService.mapDataModelToFormModel(dataModel, (<FormGroup>this.transFeeFormLocalModel));
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.transFeeFormLocalModel = this.transFeeFormRecord;
    if (!this.transFeeFormLocalModel.pristine) {
      this.transFeeFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    MasterFileFeeService.mapFormModelToDataModel((<FormGroup>this.transFeeFormLocalModel),
      this.transFeeModel);
  }


  hasFeeYes() {
    if (this.transFeeFormLocalModel.controls.hasFees.value) {
      if (this.transFeeFormLocalModel.controls.hasFees.value === GlobalsService.YES) {
        return true;
      } else {
        this.transFeeFormLocalModel.controls.billCompanyId.setValue(null);
        this.transFeeFormLocalModel.controls.billCompanyId.markAsUntouched();
        this.transFeeFormLocalModel.controls.billContactId.setValue(null);
        this.transFeeFormLocalModel.controls.billContactId.markAsUntouched();
        // todo: add more fields under hasfees here ???
      }
    }
    return false;
  }
}

