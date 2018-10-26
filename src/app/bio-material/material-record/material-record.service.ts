import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MaterialDetailsService} from '../material.details/material.details.service';

@Injectable()
export class MaterialRecordService {

  constructor() {
  }

  public static getReactiveModel(fb: FormBuilder): FormGroup {
    if (!fb) {
      return null;
    }
    return fb.group({
        id: -1,
        seqNumber: -1,
        detailsDirty: [false, Validators.required],
        isNew: true,
        materialDetails: MaterialDetailsService.getReactiveModel(fb)
      }
    );
  }

  /** returns a data model for this **/
  public static getEmptyModel() {

    const emptyModel = MaterialDetailsService.getEmptyModel();
    const materialModel = {
      id: '',
    };
    return this.extend(materialModel, emptyModel);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup,
                materialRecordModel, countryList, speciesFamilyList, tissueTypeList, derivativeList) {
    console.log(materialRecordModel);
    console.log(formRecord);
    materialRecordModel.id = formRecord.controls.id.value;
    MaterialDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.materialDetails),
      materialRecordModel, countryList, speciesFamilyList, tissueTypeList, derivativeList);

  }


  public static mapDataModelFormModel(materialRecordModel,
                formRecord: FormGroup, countryList, speciesFamilyList, tissueTypeList, derivativeList) {
    formRecord.controls.id.setValue(materialRecordModel.id);
    MaterialDetailsService.mapDataModelToFormModel(materialRecordModel,
      <FormGroup>formRecord.controls.materialDetails, countryList, speciesFamilyList, tissueTypeList, derivativeList);
  }

  public static extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
