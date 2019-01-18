import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LicenceDetailsComponent} from './licence.details/licence.details.component';
import {LicenceRecordComponent} from './licence-record/licence-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SelectModule} from 'ng2-select';
import {FileIoModule} from '../filereader/file-io/file-io.module';
import {ErrorModule} from '../error-msg/error-ui.module';
import {LicenceListComponent} from './licence.list/licence.list.component';
import {LicenceListService} from './licence.list/licence-list.service';
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
    LicenceRecordComponent,
    LicenceDetailsComponent,
    LicenceListComponent

  ],
  exports: [
    LicenceRecordComponent,
    LicenceDetailsComponent,
    LicenceListComponent
  ],
  providers: [
   LicenceListService
  ]
})
export class LicenceModule { }
