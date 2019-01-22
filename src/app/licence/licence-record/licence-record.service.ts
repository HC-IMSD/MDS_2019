import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LicenceDetailsService} from '../licence.details/licence.details.service';

@Injectable()
export class LicenceRecordService {

  constructor() {
  }

  public static getReactiveModel(fb: FormBuilder, isInternal): FormGroup {
    if (!fb) {
      return null;
    }
    return fb.group({
        id: -1,
        seqNumber: -1,
        detailsDirty: [false, Validators.required],
        isNew: true,
        licenceDetails: LicenceDetailsService.getReactiveModel(fb, isInternal)
      }
    );
  }

  /** returns a data model for this **/
  public static getEmptyModel() {

    const emptyModel = LicenceDetailsService.getEmptyModel();
    const licenceModel = {
      id: '',
    };
    return this.extend(licenceModel, emptyModel);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, licenceRecordModel) {
    console.log(licenceRecordModel);
    console.log(formRecord);
    licenceRecordModel.id = formRecord.controls.id.value;
    // licenceRecordModel.company = formRecord.controls.companyName.value;
    LicenceDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.licenceDetails), licenceRecordModel);

  }


  public static mapDataModelFormModel(licenceRecordModel, formRecord: FormGroup) {
    formRecord.controls.id.setValue(licenceRecordModel.id);
    formRecord.controls.isNew.setValue(false);
    // formRecord.controls.companyName.setValue(licenceRecordModel.company);
    LicenceDetailsService.mapDataModelToFormModel(licenceRecordModel, <FormGroup>formRecord.controls.licenceDetails);
  }

  public static extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
