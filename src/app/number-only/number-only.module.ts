import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './number.only.directive';
import {MainPipeModule} from '../main-pipe/main-pipe.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    MainPipeModule,
    TranslateModule
  ],
  declarations: [
    NumbersOnlyDirective
  ],
  exports: [
    NumbersOnlyDirective
  ]
})
export class NumbersOnlyModule { }
