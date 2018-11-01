import {
  Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, ViewChildren, QueryList, EventEmitter, Output,
  AfterViewInit, ChangeDetectorRef, DoCheck
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {ErrorSummaryComponent} from '../../error-msg/error-summary/error-summary.component';
import {MaterialRecordComponent} from '../material-record/material-record.component';
import {MaterialRecordService} from '../material-record/material-record.service';
import {MaterialListService} from './material-list.service';
import {ListOperations} from '../../list-operations';
import {TranslateService} from '@ngx-translate/core';
import {AppInfoDataLoaderService} from '../../data-loader/app-info-data-loader.service';
import {GlobalsService} from '../../globals/globals.service';
import {IMasterDetails} from '../../master-details';

//  import {ExpanderComponent} from '../../common/expander/expander.component';
@Component({
  selector: 'material-list',
  templateUrl: './material.list.component.html',
  styleUrls: ['./material.list.component.css']

})
export class MaterialListComponent extends ListOperations implements OnInit, OnChanges, AfterViewInit, DoCheck {
  @Input() public materialModel = [];
  @Input() public saveMaterial;
  @Input() public showErrors: boolean;
  @Input() countryList;
  @Output() public errors = new EventEmitter();

  @ViewChild(MaterialRecordComponent) materialChild: MaterialRecordComponent;
  @ViewChildren(ErrorSummaryComponent) errorSummaryChildList: QueryList<ErrorSummaryComponent>;

  private errorSummaryChild = null;
  private dataLoaderService: AppInfoDataLoaderService;
  // private prevRow = -1;
  public updateMaterialDetails = 0;
  public materialListForm: FormGroup;
  public newMaterialForm: FormGroup;
  public service: MaterialListService;
  public addRecordMsg = 0;
  public deleteRecordMsg = 0;
  public errorList = [];
  public dataModel = [];
  public validRec = true;
  public speciesFamilyList = [];
  public tissueTypeList = [];
  public derivativeList = [];
  public columnDefinitions = [
    {
      label: 'Name of Material',
      binding: 'material_name',
      width: '50'
    },
    {
      label: 'Name of Device',
      binding: 'device_name',
      width: '50'
    }
    /*,
    {
      label: 'Country of Origin',
      binding: 'origin_country',
      // binding2: '_label',
      width: '25'
    },
    {
      label: 'Family of Species',
      binding: 'family_of_species._label',
      width: '25'
    }
    */
  ];

  constructor(private _fb: FormBuilder, private translate: TranslateService) {
    super();
    this.service = new MaterialListService();
    this.dataModel = this.service.getModelRecordList();
    this.translate.get('error.msg.required').subscribe(res => {
      console.log(res);
    });
    this.materialListForm = this._fb.group({
      materials: this._fb.array([])
    });
    this.dataLoaderService = new AppInfoDataLoaderService();
    this.service.countryList = this.countryList;
    // if (this.translate.currentLang) {
    this.speciesFamilyList = this.dataLoaderService.getSpecFamilyList(this.translate.currentLang);
    this.tissueTypeList = this.dataLoaderService.getTissueTypeList(this.translate.currentLang);
    this.derivativeList = this.dataLoaderService.getDerivativeList(this.translate.currentLang);
    this.service.speciesFamilyList = this.speciesFamilyList;
    this.service.tissueTypeList = this.tissueTypeList;
    this.service.derivativeList = this.derivativeList;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.setExpander(this.expander);
    this.processSummaries(this.errorSummaryChildList);
    this.errorSummaryChildList.changes.subscribe(list => {
      this.processSummaries(list);
    });

    //   this.cd.detectChanges();
  }

  /**
   * Updates the error list to include the error summaries. Messages upwards
   * @param {QueryList<ErrorSummaryComponent>} list
   */
  private processSummaries(list: QueryList<ErrorSummaryComponent>): void {
    if (list.length > 1) {
      console.warn('Material List found >1 Error Summary ' + list.length);
    }
    // console.log('MaterialList process Summaries');
    this.errorSummaryChild = list.first;
    // TODO what is this for need to untangle
    this.setErrorSummary(this.errorSummaryChild);
    if (this.errorSummaryChild) {
      this.errorSummaryChild.index = this.getExpandedRow();
    }
    console.log(this.errorSummaryChild);
    this._emitErrors();
  }


  ngDoCheck() {
    this.isValid();
    this._syncCurrentExpandedRow();
  }

  /**
   *
   * @private syncs the material details record with the reactive model. Uses view child functionality
   */
  private _syncCurrentExpandedRow(): void {
    if (this.materialChild) {
      const materialFormList = this.getFormMaterialList();
      const result = this.syncCurrentExpandedRow(materialFormList);
      // Onlu update the results if there is a change. Otherwise the record will not be dirty

      if (result) {
        this.materialChild.materialFormRecord = result;
        this.updateMaterialDetails++;
      }
    } else {
      console.warn('There is no company material child');
    }
  }

  /**
   * Processes change events from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['translate']) {
      this.speciesFamilyList = this.dataLoaderService.getSpecFamilyList(this.translate.currentLang);
      this.tissueTypeList = this.dataLoaderService.getTissueTypeList(this.translate.currentLang);
      this.derivativeList = this.dataLoaderService.getDerivativeList(this.translate.currentLang);
      this.service.speciesFamilyList = this.speciesFamilyList;
      this.service.tissueTypeList = this.tissueTypeList;
      this.service.derivativeList = this.derivativeList;
    }
    if (changes['saveMaterial']) {
      this.saveMaterialRecord(changes['saveMaterial'].currentValue);
    }
    if (changes['materialModel']) {
      this.service.setModelRecordList(changes['materialModel'].currentValue);
      this.service.initIndex(changes['materialModel'].currentValue);
      this.dataModel = this.service.getModelRecordList();
      // this.materialListForm.controls['materials'] = this._fb.array([]);
      this.service.createFormDataList(this.dataModel, this._fb, this.materialListForm.controls['materials'], this.countryList);
      this.validRec = true;
    }
    if (changes['countryList']) {
      this.service.countryList = this.countryList;
    }

  }

  public isValid(override: boolean = false): boolean {
    if (override) {
      return true;
    }
    if (this.newRecordIndicator) {
      this.validRec = false;
      return false;
    } else if (this.materialChild && this.materialChild.materialFormRecord) {
      this.validRec = this.materialListForm.valid && !this.materialChild.materialFormRecord.dirty;
      return (this.materialListForm.valid && !this.materialChild.materialFormRecord.dirty);
    }
    this.validRec = this.materialListForm.valid;
    return (this.materialListForm.valid);
  }

  public getFormMaterialList(): FormArray {
    return <FormArray>(this.materialListForm.controls['materials']);
  }

  /**
   * returns an material record with a given id
   * @param {number} id - the identifier for that material record
   * @returns {FormGroup} -the material record, null if theere is no match
   * @private
   */
  private _getFormMaterial(id: number): FormGroup {
    let materialList = this.getFormMaterialList();
    return this.getRecord(id, materialList);
  }

  /**
   * Adds an material UI record to the material List
   */
  public addMaterial(): void {

    // add material to the list
    // console.log('adding an material');
    // 1. Get the list of reactive form Records
    let materialFormList = <FormArray>this.materialListForm.controls['materials'];
    console.log(materialFormList);
    // 2. Get a blank Form Model for the new record
    let formMaterial = MaterialRecordService.getReactiveModel(this._fb);
    // 3. set record id
    this.service.setRecordId(formMaterial, this.service.getNextIndex());
    // 4. Add the form record using the super class. New form is addded at the end
    this.addRecord(formMaterial, materialFormList);
    console.log(materialFormList);
    // 5. Set the new form to the new material form reference.
    this.newMaterialForm = <FormGroup> materialFormList.controls[materialFormList.length - 1];

  }

  /**
   * Saves the record to the list. If new adds to the end of the list. Does no error Checking
   * @param record
   */
  public saveMaterialRecord(record: FormGroup) {
    this.saveRecord(record, this.service);
    this.dataModel = this.service.getModelRecordList();
    this.addRecordMsg++;
    this.validRec = true;
  }

  /**
   *  Updates the error list
   * @param errs - the list of errors to broadcast
   */
  updateErrorList(errs) {
    this.errorList = errs;
    for (let err of this.errorList) {
      err.index = this.getExpandedRow();
      if (err.type === GlobalsService.errorSummClassName) {
        err.expander = this.expander; // associate the expander
      }
    }
    this._emitErrors(); // needed or will generate a valuechanged error
  }

  /***
   * Emits errors to higher level error summaries. Used for linking summaries
   * @private
   */
  private _emitErrors(): void {
    let emitErrors = [];
    // adding the child errors
    if (this.errorList) {
      emitErrors = this.errorList;
    }
    if (this.errorSummaryChild) {
      emitErrors.push(this.errorSummaryChild);
    }
    this.errors.emit(emitErrors);
  }


  /***
   * Loads the last saved version of the record data
   * @param record
   */
  public revertMaterial(record): void {
    let recordId = record.controls.id.value;

    let modelRecord = this.service.getModelRecord(recordId);
    if (!modelRecord) {
      modelRecord = this.service.getMaterialModel();
      modelRecord.id = recordId;
    }
    let rec = this._getFormMaterial(recordId);
    if (rec) {
      MaterialRecordService.mapDataModelFormModel(modelRecord, rec, this.countryList,
        this.service.speciesFamilyList, this.service.tissueTypeList, this.service.derivativeList);
    } else {
      // should never happen, there should always be a UI record
      console.warn('MaterialList:rec is null');
    }
  }

  /**
   * Deletes a record from the UI list and the model list, if it exists
   * @param id
   */
  public deleteMaterial(id): void {
    let materialList = this.getFormMaterialList();
    this.deleteRecord(id, materialList, this.service);
    this.validRec = true;
    this.deleteRecordMsg++;
  }

  /**
   * check if its record exists
   */
  public isDirty(): boolean {
    if (this.materialChild && this.materialChild.materialFormRecord) {
      return (this.materialChild.materialFormRecord.dirty);
    } else {
      return false;
    }
  }


}
