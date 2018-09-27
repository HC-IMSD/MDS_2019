import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class DossierDetailsService {

  private registrarList: Array<any>;

  constructor() {
    this.registrarList = [];
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      dossierType: [GlobalsService.DEVICE_TYPE_EN, Validators.required],
      companyId: [null, Validators.required],
      contactId: [null, Validators.required],
      deviceClass: [null, Validators.required],
      deviceName: [null, Validators.required],
      hasQMSC: [null, Validators.required],
      qMSCRegistrar: [null, Validators.required],
      licenceAppType: [null, Validators.required],
      additionalField: ['', []]
    });
  }

  /**
   * Gets an empty data model
   *
   */
  public static getEmptyModel() {

    return (
      {
        dossier_type: GlobalsService.DEVICE_TYPE_EN,
        company_id: '',
        contact_id: '',
        device_class: '',
        device_name: '',
        has_qmsc: '',
        registrar: '',
        licence_application_type: '',
        additional_field: ''
      }
    );
  }

  /**
   * Gets an data array
   *
   */
  public static getDeviceClassList() {
    return [
      {
        id: 'C1',
        label_en: 'Class II',
        label_fr: 'fr_Class II'
      },
      {
        id: 'C2',
        label_en: 'Class III',
        label_fr: 'fr_Class III'
      },
      {
        id: 'C3',
        label_en: 'Class IV',
        label_fr: 'fr_Class IV'
      }
    ];
  }

  /**
   * Gets an yesno array
   *
   */
  public static getYesNoList() {
    return [
      GlobalsService.YES,
      GlobalsService.NO
    ];
  }

  /**
   * Gets an data array
   *
   */
  public static getLicenceAppTypeList() {
    return [
      {
        id: 'D',
        label_en: 'Single Device',
        label_fr: 'Instrument à article unique'
      },
      {
        id: 'S',
        label_en: 'System',
        label_fr: 'Système'
      },
      {
        id: 'K',
        label_en: 'Test Kit',
        label_fr: 'Trousse d\'essai'
      },
      {
        id: 'F',
        label_en: 'Device Family',
        label_fr: 'Famille d\'instruments'
      },
      {
        id: 'G',
        label_en: 'Device Group',
        label_fr: 'Groupe d\'instruments'
      },
      {
        id: 'Y',
        label_en: 'Device Group Family',
        label_fr: 'Famille de groupe d\'instruments'
      },
      {
        id: 'U',
        label_en: 'Unknown',
        label_fr: 'Indéterminé'
      }
    ];
  }


  public static mapFormModelToDataModel(formRecord: FormGroup, addressModel, registrarList) {
    addressModel.address = formRecord.controls.address.value;
    addressModel.city = formRecord.controls.city.value;
    if (formRecord.controls.country.value && formRecord.controls.country.value.length > 0) {
      const country_record = DossierDetailsService.findRecordByTerm(registrarList, formRecord.controls.country.value[0], 'id');
      // this removes the 'text' property that the control needs
      if (country_record && country_record.id) {
        addressModel.country = {
          '__text': country_record.id,
          '_label_en': country_record.en,
          '_label_fr': country_record.fr
        };
      } else {
        addressModel.country = null;
      }
    } else {
      addressModel.country = null;
    }
    addressModel.postal = formRecord.controls.postal.value;
    addressModel.prov_lov = formRecord.controls.provList.value;
    addressModel.prov_text = formRecord.controls.provText.value;
  }

  public static mapDataModelToFormModel(addressModel, formRecord: FormGroup, registrarList) {
    formRecord.controls.address.setValue(addressModel.address);
    formRecord.controls.city.setValue(addressModel.city);
    formRecord.controls.postal.setValue(addressModel.postal);
    const recordIndex = ListService.getRecord(registrarList, addressModel.country.__text, 'id');
    let labelText = '';
    if (recordIndex > -1) {
      labelText = registrarList[recordIndex].text;
    }
    // if (addressModel.country) {
    //   formRecord.controls.country.setValue([
    //     {
    //       'id': addressModel.country.__text,
    //       'text': labelText
    //     }
    //   ]);
    //
    //   if (AddressDetailsService.isCanada(addressModel.country.__text) ||
    //       AddressDetailsService.isUsa(addressModel.country.__text)) {
    //     formRecord.controls.provList.setValue(addressModel.prov_lov);
    //   } else {
    //     formRecord.controls.provText.setValue(addressModel.prov_text);
    //   }
    // } else {
    //   formRecord.controls.country.setValue(null);
    // }
  }

  /**
   * Sets the country list to be used for all addres details records
   * @param {Array<any>} value
   */
  public setRegistrarList(value: Array<any>) {
    this.registrarList = value;

  }

  /**
   * Find a record by its unique id,. If a dup, returns first instance
   * @param list
   * @param criteria
   * @returns {any}
   */
  public static findRecordByTerm(list, criteria, searchTerm) {

    let result = list.filter(
      item => item[searchTerm] === criteria[searchTerm]);
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

}
