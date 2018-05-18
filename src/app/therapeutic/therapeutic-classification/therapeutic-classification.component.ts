import {
  AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges,
  ViewChildren
} from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ControlMessagesComponent} from '../../../../common/app/error-msg/control-messages.component/control-messages.component';
import {TheraClassService} from './thera-class.service';

@Component({
  selector: 'therapeutic-classification',
  templateUrl: './therapeutic-classification.component.html',
  styleUrls: ['./therapeutic-classification.component.css']
})
export class TherapeuticClassificationComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('group') public theraFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors:boolean;
  @Output() errors = new EventEmitter();
  @Output() deleteRecord=new EventEmitter();
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;
  public theraDetailsModel: FormGroup;

  public showFieldErrors:boolean=false;
  private service:TheraClassService;

  constructor(private _fb:FormBuilder) {
    this.service=new TheraClassService();
    this.theraDetailsModel=TheraClassService.getReactiveModel(_fb);
  }

  ngOnInit() {

  }
  ngAfterViewInit(){
    //console.log("after view init")
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
      console.log(temp);
      this.errors.emit(temp);
    });
    this.msgList.notifyOnChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showErrors']) {
      this.showFieldErrors = changes['showErrors'].currentValue;
      this._emitErrors();
    }
    if (changes['group']) {
      this.theraDetailsModel = this.theraFormRecord;
      this._emitErrors();
    }
    if (changes['detailsChanged']) { //used as a change indicator for the model
      if (this.theraFormRecord) {
        this.theraDetailsModel = this.theraFormRecord;
      } else {
        this.theraFormRecord = TheraClassService.getReactiveModel(this._fb);
      }
      this.theraFormRecord.markAsPristine();
      this._emitErrors();
    }
  }

  public deleteThera(){
      this.deleteRecord.emit(this.theraDetailsModel.controls.id.value);
      this._emitErrors();
  }

  private _emitErrors(){
    let temp = [];
    if (this.msgList) {
      this.msgList.forEach(item => {
        temp.push(item);
      });
    }
    this.errors.emit(temp);
  }

}
