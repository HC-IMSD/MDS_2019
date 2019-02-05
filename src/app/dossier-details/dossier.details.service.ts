import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class DossierDetailsService {

  private static licenceAppTypeList: Array<any> = DossierDetailsService.getRawLicenceAppTypeList();

  constructor() {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      dossierType: [GlobalsService.DEVICE_TYPE_EN, []],
      companyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      contactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
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

  // todo: move statice data to data loader serivce
  /**
   * Gets an data array
   *
   */
  public getDeviceClassList() {
    return ['DC2', 'DC3', 'DC4'];
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
  private static getRawLicenceAppTypeList() {
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
  public static getLicenceAppTypeList(lang) {
    const rawList = this.getRawLicenceAppTypeList();
    return this._convertListText(rawList, lang);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, dossierModel, registrarList) {
    dossierModel.dossier_type = formRecord.controls.dossierType.value;
    if (formRecord.controls.companyId.value) {
      dossierModel.company_id = 'k' + formRecord.controls.companyId.value;
    }
    dossierModel.contact_id = formRecord.controls.contactId.value;
    dossierModel.device_class = formRecord.controls.deviceClass.value;
    dossierModel.device_name = formRecord.controls.deviceName.value;
    dossierModel.has_qmsc = formRecord.controls.hasQMSC.value;
    if (formRecord.controls.qMSCRegistrar.value) {
      const recordIndex1 = ListService.getRecord(registrarList, formRecord.controls.qMSCRegistrar.value, 'id');
      if (recordIndex1 > -1) {
        dossierModel.registrar = {
          '__text': registrarList[recordIndex1].id,
          '_label_en': registrarList[recordIndex1].en,
          '_label_fr': registrarList[recordIndex1].fr
        };
      }
    } else {
      dossierModel.registrar = null;
    }
    if (formRecord.controls.licenceAppType.value) {
      const recordIndex2 = ListService.getRecord(this.licenceAppTypeList, formRecord.controls.licenceAppType.value, 'id');
      if (recordIndex2 > -1) {
        dossierModel.licence_application_type = {
          '__text': this.licenceAppTypeList[recordIndex2].id,
          '_label_en': this.licenceAppTypeList[recordIndex2].en,
          '_label_fr': this.licenceAppTypeList[recordIndex2].fr
        };
      }
    } else {
      dossierModel.licence_application_type = null;
    }
    dossierModel.additional_field = formRecord.controls.additionalField.value;
  }

  public static mapDataModelToFormModel(dossierModel, formRecord: FormGroup, registrarList) {
    if ( dossierModel.company_id.length > 0 ) {
      let comIDs = dossierModel.company_id.split('k');
      // console.log("company_id" + comIDs[1]);
      formRecord.controls.companyId.setValue(comIDs[1]);
    }
    formRecord.controls.dossierType.setValue(dossierModel.dossier_type);
    formRecord.controls.contactId.setValue(dossierModel.contact_id);
    formRecord.controls.deviceClass.setValue(dossierModel.device_class);
    formRecord.controls.deviceName.setValue(dossierModel.device_name);
    formRecord.controls.hasQMSC.setValue(dossierModel.has_qmsc);
    const recordIndex = ListService.getRecord(registrarList, dossierModel.registrar.__text, 'id');
    if (recordIndex > -1) {
      formRecord.controls.qMSCRegistrar.setValue(registrarList[recordIndex].id);
    } else {
      formRecord.controls.qMSCRegistrar.setValue(null);
    }
    const recordIndex2 = ListService.getRecord(this.licenceAppTypeList, dossierModel.licence_application_type.__text, 'id');
    if (recordIndex2 > -1) {
      formRecord.controls.licenceAppType.setValue(this.licenceAppTypeList[recordIndex2].id);
    } else {
      formRecord.controls.licenceAppType.setValue(null);
    }
    formRecord.controls.additionalField.setValue(dossierModel.additional_field);
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
  private static _convertListText(rawList, lang) {
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
