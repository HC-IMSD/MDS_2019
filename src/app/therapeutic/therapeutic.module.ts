import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TherapeuticClassificationComponent } from './therapeutic-classification/therapeutic-classification.component';
import { TheraListComponent } from './thera-list/thera-list.component';
import {ErrorModule} from '../error-msg/error-ui.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonFeatureModule} from '../common/common-feature.module';
import {TheraClassService} from './therapeutic-classification/thera-class.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    CommonFeatureModule
  ],
  declarations: [
    TherapeuticClassificationComponent,
    TheraListComponent
  ],
  exports:[
    TherapeuticClassificationComponent,
    TheraListComponent
  ],
  providers: [
    TheraClassService
    ]
})
export class TherapeuticModule { }
