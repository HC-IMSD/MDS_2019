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
  public getReactiveModel(fb: FormBuilder) {
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
  public getEmptyModel() {

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
  public getDeviceClassList() {
    return ['DC1', 'DC2', 'DC3'];
  }

  /**
   * Gets an yesno array
   *
   */
  public getYesNoList() {
    return [
      GlobalsService.YES,
      GlobalsService.NO
    ];
  }

  /**
   * Gets an data array
   *
   */
  private getRawLicenceAppTypeList() {
    return [
      {
        id: 'D',
        en: 'Single Device',
        fr: 'Instrument à article unique'
      },
      {
        id: 'S',
        en: 'System',
        fr: 'Système'
      },
      {
        id: 'K',
        en: 'Test Kit',
        fr: 'Trousse d\'essai'
      },
      {
        id: 'F',
        en: 'Device Family',
        fr: 'Famille d\'instruments'
      },
      {
        id: 'G',
        en: 'Device Group',
        fr: 'Groupe d\'instruments'
      },
      {
        id: 'Y',
        en: 'Device Group Family',
        fr: 'Famille de groupe d\'instruments'
      },
      {
        id: 'U',
        en: 'Unknown',
        fr: 'Indéterminé'
      }
    ];
  }

  /**
   * Gets an data array
   *
   */
  public getLicenceAppTypeList(lang) {
    const rawList = this.getRawLicenceAppTypeList();
    return this._convertListText(rawList, lang);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, dossierModel, registrarList) {
    dossierModel.dossier_type = formRecord.controls.dossierType.value;
    dossierModel.company_id = formRecord.controls.companyId.value;
    dossierModel.contact_id = formRecord.controls.contactId.value;
    dossierModel.device_class = formRecord.controls.deviceClass.value;
    dossierModel.device_name = formRecord.controls.deviceName.value;
    dossierModel.has_qmsc = formRecord.controls.hasQMSC.value;
    if (formRecord.controls.qMSCRegistrar.value) {
        dossierModel.registrar = {
          '__text': formRecord.controls.qMSCRegistrar.value.id,
          '_label_en': formRecord.controls.qMSCRegistrar.value.en,
          '_label_fr': formRecord.controls.qMSCRegistrar.value.fr
        };
    } else {
      dossierModel.registrar = null;
    }
    if (formRecord.controls.licenceAppType.value) {
      dossierModel.licence_application_type = {
        '__text': formRecord.controls.licenceAppType.value.id,
        '_label_en': formRecord.controls.licenceAppType.value.en,
        '_label_fr': formRecord.controls.licenceAppType.value.fr
      };
    } else {
      dossierModel.licence_application_type = null;
    }
    dossierModel.additional_field = formRecord.controls.additionalField.value;
  }

  public static mapDataModelToFormModel(dossierModel, formRecord: FormGroup, registrarList) {
    formRecord.controls.dossierType.setValue(dossierModel.dossier_type);
    formRecord.controls.companyId.setValue(dossierModel.company_id);
    formRecord.controls.contactId.setValue(dossierModel.contact_id);
    formRecord.controls.deviceClass.setValue(dossierModel.device_class);
    formRecord.controls.deviceName.setValue(dossierModel.device_name);
    formRecord.controls.hasQMSC.setValue(dossierModel.has_qmsc);
    const recordIndex = ListService.getRecord(registrarList, dossierModel.registrar.__text, 'id');
    let labelText = '';
    if (recordIndex > -1) {
      labelText = registrarList[recordIndex].text;
    }
    if (dossierModel.country) {
      formRecord.controls.qMSCRegistrar.setValue([
        {
          'id': dossierModel.country.__text,
          'text': labelText
        }
      ]);
    } else {
      formRecord.controls.qMSCRegistrar.setValue(null);
    }
    formRecord.controls.deviceName.setValue(dossierModel.device_name);
    formRecord.controls.hasQMSC.setValue(dossierModel.has_qmsc);
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

  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  private _convertListText(rawList, lang) {
    const result = [];
    if (lang === GlobalsService.FRENCH) {
      rawList.forEach(item => {
        item.text = item.fr;
        result.push(item);
        //  console.log(item);
      });
    } else {
      rawList.forEach(item => {
        item.text = item.en;
        // console.log("adding country"+item.text);
        result.push(item);
        // console.log(item);
      });
    }
    return result;
  }

}
