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

  public static mapFormModelToDataModel(formRecord: FormGroup, requesterRecordModel, userList) {
    console.log(requesterRecordModel);
    console.log(formRecord);
    requesterRecordModel.id = formRecord.controls.id.value;
    if (requesterRecordModel.requester && requesterRecordModel.requester._id) {
      requesterRecordModel.requester_text = requesterRecordModel.requester._id;
      requesterRecordModel.requester.requester_text = requesterRecordModel.requester._id;
    } else {
      requesterRecordModel.requester_text = '';
      requesterRecordModel.requester = {'requester_text': ''};
    }
    // requesterRecordModel.company = formRecord.controls.companyName.value;
    RequesterDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.requesterDetails), requesterRecordModel, userList);

  }


  public static mapDataModelFormModel(requesterRecordModel, formRecord: FormGroup, userList) {
    formRecord.controls.id.setValue(Number(requesterRecordModel.id));
    formRecord.controls.isNew.setValue(false);
    // formRecord.controls.companyName.setValue(requesterRecordModel.company);
    RequesterDetailsService.mapDataModelToFormModel(requesterRecordModel, <FormGroup>formRecord.controls.requesterDetails, userList);
  }

  public static extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
