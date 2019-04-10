import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeviceDetailsComponent} from './device.details/device.details.component';
import {DeviceRecordComponent} from './device-record/device-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SelectModule} from 'ng2-select';
import {FileIoModule} from '../filereader/file-io/file-io.module';
import {ErrorModule} from '../error-msg/error-ui.module';
import {DeviceListComponent} from './device.list/device.list.component';
import {DeviceListService} from './device.list/device-list.service';
import {CommonFeatureModule} from '../common/common-feature.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    FileIoModule,
    ErrorModule,
    CommonFeatureModule,
    TranslateModule

  ],
  declarations: [
    DeviceRecordComponent,
    DeviceDetailsComponent,
    DeviceListComponent

  ],
  exports: [
    DeviceRecordComponent,
    DeviceDetailsComponent,
    DeviceListComponent
  ],
  providers: [
   DeviceListService
  ]
})
export class DeviceModule { }
