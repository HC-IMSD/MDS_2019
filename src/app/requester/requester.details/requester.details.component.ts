import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';
import {RequesterDetailsService} from './requester.details.service';
import {isArray} from 'util';


@Component({
  selector: 'requester-details',
  templateUrl: 'requester.details.component.html',
  encapsulation: ViewEncapsulation.None
})

/**
 * Requester Details Component is used for Company form
 */
export class RequesterDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public requesterFormLocalModel: FormGroup;
  @Input('group') public requesterRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() userList: Array<any>;
  @Input() showErrors: boolean;
  @Input() newRecordIndicator: boolean;
  @Output() saveRecord = new EventEmitter();
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public requesters: Array<any> = [];
  public showFieldErrors: boolean = false;
  private detailsService: RequesterDetailsService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.detailsService = new RequesterDetailsService();
  }

  ngOnInit() {
    if (!this.requesterFormLocalModel) {
      this.requesterFormLocalModel = RequesterDetailsService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;

  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);
    });
    this.msgList.notifyOnChanges();
    // this.cdr.detectChanges();

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
      if (this.requesterRecord) {
        this.setToLocalModel();

      } else {
        this.requesterFormLocalModel = RequesterDetailsService.getReactiveModel(this._fb);
        this.requesterFormLocalModel.markAsPristine();
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
    if (changes['userList']) {
      this.requesters = changes['userList'].currentValue;
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.requesterFormLocalModel = this.requesterRecord;
    if (!this.requesterFormLocalModel.pristine) {
      this.requesterFormLocalModel.markAsPristine();
    }
  }

  typed(rec) {
    // let content = rec.toString();
    if (!rec) {
      this.requesterFormLocalModel.controls.requester.setValue(null);
    }
    this.saveRecord.emit((this.requesterFormLocalModel));
    this.cdr.detectChanges();
  }

  onblur(rec) {
    // console.log('input is typed');
    // if (rec) {
    //   this.requesterFormLocalModel.controls.requester.setValue([rec]);
    // }
    if ( this.requesterFormLocalModel.invalid) {
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.errorList.emit(temp);
    // } else {
    //   this.saveRecord.emit((this.requesterFormLocalModel));
    }
  }
  showRequesterError() {
    const hasRequester = document.querySelector('#requester');
    return hasRequester ? true : false;
  }
}

