import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class ApplicationInfoBaseService {


  constructor() {
  }

  /**
   * Gets the reactive forms Model for generalInfo details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public static getReactiveModel(fb: FormBuilder) {
    if (!fb) {
      return null;
    }
    return fb.group({
      enrolVersion: '0.0',
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(6)]],
      dossierId: ['', [Validators.required, Validators.min(7)]],
      qmscNum: [null, Validators.required],
      licenceAppType: [null, Validators.required]
    });
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyAppInfoDetailsModel() {

    return (
      {
        enrol_version: '0.0',
        last_saved_date: '',  // todo: to map into form model ???
        company_id: '',
        dossier_id: '',
        qmsc_number: '',
        licence_application_type: {
            '__text': '',
            '_label_en': '',
            '_label_fr': ''
          }
      }
    );
  }
}
