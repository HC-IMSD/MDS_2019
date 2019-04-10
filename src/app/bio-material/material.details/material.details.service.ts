import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../../globals/globals.service';
import {ValidationService} from '../../validation.service';
import {ListService} from '../../list-service';

@Injectable()
export class MaterialDetailsService {

  constructor() {
  }

  /**
   * Gets the reactive forms Model for material details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      materialId: '',
      materialName: ['', Validators.required],
      deviceName: ['', Validators.required],
      originCountry: [[{id: '', text: ''}], []],
      specFamily: ['', Validators.required],
      tissueType: [[{id: '', text: ''}], []],
      tissueTypeOtherDetails: '',
      derivative: [[{id: '', text: ''}], []],
      derivativeOtherDetails: ''
    });
  }

  /**
   * Gets an empty
   *
   */
  public static getEmptyModel() {

    return (
      {
        material_id: '',
        material_name: '',
        device_name: '',
        origin_country: '',
        family_of_species: '',
        tissue_substance_type: '',
        tissue_type_other_details: '',
        derivative: '',
        derivative_other_details: ''
      }
    );
  }

  public static mapFormModelToDataModel(formRecord: FormGroup,
           materialModel, countryList, speciesFamilyList, tissueTypeList, derivativeList) {
    materialModel.material_id = formRecord.controls.materialId.value;
    materialModel.material_name = formRecord.controls.materialName.value;
    materialModel.device_name = formRecord.controls.deviceName.value;
    if (formRecord.controls.originCountry.value && formRecord.controls.originCountry.value.length > 0) {
      const country_record = MaterialDetailsService.findRecordByTerm(countryList, formRecord.controls.originCountry.value[0], 'id');
      // this removes the 'text' property that the control needs
      if (country_record && country_record.id) {
        materialModel.origin_country = {
          '__text': country_record.text,
          '_id': country_record.id,
          '_label_en': country_record.en,
          '_label_fr': country_record.fr
        };
      } else {
        materialModel.origin_country = null;
      }
    } else {
      materialModel.origin_country = null;
    }

    if (formRecord.controls.specFamily.value && formRecord.controls.specFamily.value.length > 0) {
      const species_record = MaterialDetailsService.findRecordByTerm(speciesFamilyList,
        formRecord.controls.specFamily.value[0], 'id');
      // this removes the 'text' property that the control needs
      if (species_record && species_record.id) {
        materialModel.family_of_species = {
          '__text': species_record.text,
          '_id': species_record.id,
          '_label_en': species_record.label_en,
          '_label_fr': species_record.label_fr
        };
      } else {
        materialModel.family_of_species = null;
      }
    } else {
      materialModel.family_of_species = null;
    }

    if (formRecord.controls.tissueType.value && formRecord.controls.tissueType.value.length > 0) {
      const tissue_type_record = MaterialDetailsService.findRecordByTerm(tissueTypeList,
        formRecord.controls.tissueType.value[0], 'id');
      // this removes the 'text' property that the control needs
      if (tissue_type_record && tissue_type_record.id) {
        materialModel.tissue_substance_type = {
          '__text': tissue_type_record.text,
          '_id': tissue_type_record.id,
          '_label_en': tissue_type_record.label_en,
          '_label_fr': tissue_type_record.label_fr
        };
      } else {
        materialModel.tissue_substance_type = null;
      }
    } else {
      materialModel.tissue_substance_type = null;
    }
    materialModel.tissue_type_other_details = formRecord.controls.tissueTypeOtherDetails.value;

    materialModel.derivative = formRecord.controls.derivative.value;
    if (formRecord.controls.derivative.value && formRecord.controls.derivative.value.length > 0) {
      const derivative_record = MaterialDetailsService.findRecordByTerm(derivativeList,
        formRecord.controls.derivative.value[0], 'id');
      // this removes the 'text' property that the control needs
      if (derivative_record && derivative_record.id) {
        materialModel.derivative = {
          '__text': derivative_record.text,
          '_id': derivative_record.id,
          '_label_en': derivative_record.label_en,
          '_label_fr': derivative_record.label_fr
        };
      } else {
        materialModel.derivative = null;
      }
    } else {
      materialModel.derivative = null;
    }
    materialModel.derivative_other_details = formRecord.controls.derivativeOtherDetails.value;
  }

  public static mapDataModelToFormModel(materialModel,
               formRecord: FormGroup, countryList, speciesFamilyList, tissueTypeList, derivativeList) {
    formRecord.controls.materialId.setValue(materialModel.material_id);
    formRecord.controls.materialName.setValue(materialModel.material_name);
    formRecord.controls.deviceName.setValue(materialModel.device_name);


    if (materialModel.origin_country) {
      const recordIndex = ListService.getRecord(countryList, materialModel.origin_country.__text, 'id');
      let labelText = '';
      if (recordIndex > -1) {
        labelText = countryList[recordIndex].text;
      }
      formRecord.controls.originCountry.setValue([
        {
          'id': materialModel.origin_country.__text,
          'text': labelText
        }
      ]);
    } else {
      formRecord.controls.originCountry.setValue([{id: '', text: ''}]);
    }


    if (materialModel.family_of_species) {
      const sfRecordIndex = ListService.getRecord(speciesFamilyList, materialModel.family_of_species.__text, 'id');
      let sfLabelText = '';
      if (sfRecordIndex > -1) {
        sfLabelText = speciesFamilyList[sfRecordIndex].text;
      }
      formRecord.controls.specFamily.setValue([
        {
          'id': materialModel.family_of_species.__text,
          'text': sfLabelText
        }
      ]);
    } else {
      formRecord.controls.specFamily.setValue(null);
    }


    if (materialModel.tissue_substance_type) {
      const ttRecordIndex = ListService.getRecord(tissueTypeList, materialModel.tissue_substance_type.__text, 'id');
      let ttLabelText = '';
      if (ttRecordIndex > -1) {
        ttLabelText = tissueTypeList[ttRecordIndex].text;
      }
      formRecord.controls.tissueType.setValue([
        {
          'id': materialModel.tissue_substance_type.__text,
          'text': ttLabelText
        }
      ]);
    } else {
      formRecord.controls.tissueType.setValue([{id: '', text: ''}]);
    }
    formRecord.controls.tissueTypeOtherDetails.setValue(materialModel.tissue_type_other_details);


    if (materialModel.derivative) {
      const deRecordIndex = ListService.getRecord(derivativeList, materialModel.derivative.__text, 'id');
      let deLabelText = '';
      if (deRecordIndex > -1) {
        deLabelText = derivativeList[deRecordIndex].text;
      }
      formRecord.controls.derivative.setValue([
        {
          'id': materialModel.derivative.__text,
          'text': deLabelText
        }
      ]);
    } else {
      formRecord.controls.derivative.setValue([{id: '', text: ''}]);
    }
    formRecord.controls.derivativeOtherDetails.setValue(materialModel.derivative_other_details);
  }

  public static getRecordId(record: FormGroup) {
    return (record.controls.id.value);
  }

  public static setRecordId(record: FormGroup, value: number): void {
    if (!record) {
      return;
    }
    record.controls.id.setValue(value);
  }

  /**
   * Find a record by its unique id,. If a dup, returns first instance
   * @param list
   * @param criteria
   * @returns {any}
   */
  public static findRecordByTerm(list, criteria, searchTerm) {

    const result = list.filter(
      item => item[searchTerm] === criteria[searchTerm]);
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

}
