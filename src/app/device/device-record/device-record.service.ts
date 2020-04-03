import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeviceDetailsService} from '../device.details/device.details.service';

@Injectable()
export class DeviceRecordService {

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
        deviceDetails: DeviceDetailsService.getReactiveModel(fb)
      }
    );
  }

  /** returns a data model for this **/
  public static getEmptyModel() {

    const emptyModel = DeviceDetailsService.getEmptyModel();
    const deviceModel = {
      id: '',
    };
    return this.extend(deviceModel, emptyModel);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, deviceRecordModel) {
    console.log(deviceRecordModel);
    console.log(formRecord);
    deviceRecordModel.id = formRecord.controls.id.value;
    // deviceRecordModel.company = formRecord.controls.companyName.value;
    DeviceDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.deviceDetails), deviceRecordModel);

  }


  public static mapDataModelFormModel(deviceRecordModel, formRecord: FormGroup) {
    formRecord.controls.id.setValue(Number(deviceRecordModel.id));
    formRecord.controls.isNew.setValue(false);
    // formRecord.controls.companyName.setValue(deviceRecordModel.company);
    DeviceDetailsService.mapDataModelToFormModel(deviceRecordModel, <FormGroup>formRecord.controls.deviceDetails);
  }

  public static extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
