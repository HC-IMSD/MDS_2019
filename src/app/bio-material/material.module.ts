import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialDetailsComponent} from './material.details/material.details.component';
import {MaterialRecordComponent} from './material-record/material-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SelectModule} from 'ng2-select';
import {FileIoModule} from '../filereader/file-io/file-io.module';
import {ErrorModule} from '../error-msg/error-ui.module';
import {MaterialListComponent} from './material.list/material.list.component';
import {MaterialListService} from './material.list/material-list.service';
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
    MaterialRecordComponent,
    MaterialDetailsComponent,
    MaterialListComponent

  ],
  exports: [
    MaterialRecordComponent,
    MaterialDetailsComponent,
    MaterialListComponent
  ],
  providers: [
   MaterialListService
  ]
})
export class MaterialModule { }
