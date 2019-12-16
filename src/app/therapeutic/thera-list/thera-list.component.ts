import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ListOperations} from '../../list-operations';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TheraClassService} from '../therapeutic-classification/thera-class.service';
import {TherapeuticClassificationComponent} from '../therapeutic-classification/therapeutic-classification.component';
import {TheraListService} from './thera-list.service';

@Component({
  selector: 'thera-list',
  templateUrl: './thera-list.component.html',
  styleUrls: ['./thera-list.component.css']
})
export class TheraListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(TherapeuticClassificationComponent, {static: true}) theraDetailsRecord: TherapeuticClassificationComponent;
  @Output() errors = new EventEmitter();
  @Input() showErrors:boolean;
  @Input ('group') formDataList:FormArray; //TO DO not needed
  @Input () modelData;
  public theraListForm: FormGroup;
  /**
   * List of error messages to pass to parent components
   * @type {any[]}
   */
  public errorList = [];
  /**
   * The list of details records
   * @type {any[]}
   */
  public dataModel = [];
  /**
   * Counter used to send a message to the expander that a record was added
   * @type {number}
   */
  public addRecordMsg:number=0;

  /**
   *  Counter used to sena a message to the expander that a record was deleted
   */
  public deleteRecordMsg:number;
  /**
   * Tracks weather the current details record is valid or not
   */
  public validRec:boolean;
  /**
   *  Service containing much of the generic logic for the list
   */
  public service:TheraListService;
  /**
   *
   * @type {number}
   */
  public updateDetails:number=0;
  public showFieldErrors:boolean=false;
  public expandOnAdd:boolean;
  public collapseExpander:number;
  public columnDefinitions = [
    {
      label: 'THERACLASS',
      binding: 'theraDetails',
      width: '100'
    },
  ];

  constructor(private _fb:FormBuilder) {
    super();
    this.validRec=true;
    this.service=new TheraListService();
    this.deleteRecordMsg=0;
    this.expandOnAdd=false;
    this.collapseExpander=0;
  }

  ngOnInit() {
    /*this.theraListForm = this._fb.group({
      theraList:   this._fb.array([])
    });*/
    if(!this.theraListForm) {
      this.theraListForm = TheraListService.getEmptyReactiveModel(this._fb);
      this.dataModel = this.service.getModelRecordList();
    }
  }

  ngAfterViewInit() {
    //subscribe to value changes in the form. Going to update modal automatically as the
    this. _subscribeToFormChanges();
  }
  _subscribeToFormChanges(){
    this.theraListForm.valueChanges.subscribe(form => {
      this.validRec=this.theraListForm.valid;
      this._updateModelRecord();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
      if(changes['showErrors']){

      }
      /*if(changes['group']){
        this.theraListForm =changes['group'].currentValue;
      }*/
    if(changes['modelData']){
      this.service.setModelRecordList(changes['modelData'].currentValue);
      /** this section collapse the expander and resets the validity
       * If a user was editing a record, it may be invalid
       * This assumes that all the incoming data is valid (by SOP)
       * **/
      this.collapseExpander++;
      this.validRec=true;

      this.dataModel=this.service.getModelRecordList();
      this.theraListForm=this.service.createFormRecordsFromModel(this._fb);
      this.processTheraErrors([]);
      this. _subscribeToFormChanges();
    }
  }
  ngDoCheck() {
    this._syncCurrentExpandedRow();
  }

  /**
   * Synchs the model record with the form record since there is no save
   * @private
   */
  private _updateModelRecord(){

    let rowNum=this.getExpandedRow();
    if(rowNum<0) return;
    //MOVE to record service
    let formList=this.getFormList();
    if(!formList) return;
    let formRecord=<FormGroup> formList.controls[rowNum];
    if(!formRecord) return;
    this.service.updateModelRecord(this.dataModel,formRecord);
  }

  public addClassRecord(){
    //1. Get a blank form record
    this.expandOnAdd=true;
    let rec=TheraClassService.getReactiveModel(this._fb);
    //Set the index immediately
    rec.controls.id.setValue(this.service.getNextIndex());
    //get an empty model record, update idea and add
    var emptyModel=TheraClassService.getEmptyModelRecord();
    emptyModel.id= rec.controls.id.value;
    this.dataModel.push(emptyModel);
    //add the form data record
    //add the form data record
    this.addRecord(rec,this.getFormList());
    //set the child details to the recrod
    this.theraDetailsRecord.theraFormRecord=rec;
    //update the expander message
    this.addRecordMsg++;
    this.validRec=false;
  }
  public getFormList(): FormArray {
    return <FormArray>(this.theraListForm.controls['theraList']);
  }
  private _syncCurrentExpandedRow():void {
    if (this.theraDetailsRecord) {
      let formList = this.getFormList();
      let result = this.syncCurrentExpandedRow(formList);
      //Onlu update the results if there is a change. Otherwise the record will not be dirty
      if (result) {
        //alternate attach to the model directly. Is there any benefit to doing this?
        this.theraDetailsRecord.theraFormRecord = result;
        this.updateDetails++;
      }
    } else {
      console.warn('There is no company address child');
    }
  }
  public delete(id): void {
    this.deleteRecord(id,this.getFormList(),this.service);
    this.deleteRecordMsg++;
  }

  processTheraErrors(errs:Array<any>){
    if(this.getFormList().length==0){
      errs=[];
    }
    this.errors.emit(errs);
  };


}
