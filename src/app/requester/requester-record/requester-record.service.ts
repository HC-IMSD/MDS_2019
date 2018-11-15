import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RequesterDetailsService} from '../requester.details/requester.details.service';

@Injectable()
export class RequesterRecordService {

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
        requesterDetails: RequesterDetailsService.getReactiveModel(fb)
      }
    );
  }

  /** returns a data model for this **/
  public static getEmptyModel() {

    const emptyModel = RequesterDetailsService.getEmptyModel();
    const requesterModel = {
      id: '',
    };
    return this.extend(requesterModel, emptyModel);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, requesterRecordModel) {
    console.log(requesterRecordModel);
    console.log(formRecord);
    requesterRecordModel.id = formRecord.controls.id.value;
    // requesterRecordModel.company = formRecord.controls.companyName.value;
    RequesterDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.requesterDetails), requesterRecordModel);

  }


  public static mapDataModelFormModel(requesterRecordModel, formRecord: FormGroup) {
    formRecord.controls.id.setValue(requesterRecordModel.id);
    // formRecord.controls.companyName.setValue(requesterRecordModel.company);
    RequesterDetailsService.mapDataModelToFormModel(requesterRecordModel, <FormGroup>formRecord.controls.requesterDetails);
  }

  public static extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
