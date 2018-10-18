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
      status: '',
      enrolVersion: 0.0,
      lastSavedDate: '',
      companyId: ['', [Validators.required, Validators.min(6)]],
      dossierId: ['', [Validators.required, Validators.min(7)]]
    });
  }

  /**
   * Gets an empty Address Details Model
   *
   */
  public static getEmptyAppInfoDetailsModel() {

    return (
      {
        lastSavedDate: '',
        address: '',
        provText: '',
        city: '',
        country: {
            '__text': '',
            '_label_en': '',
            '_label_fr': ''
          },
        postal: ''
      }
    );
  }
}
