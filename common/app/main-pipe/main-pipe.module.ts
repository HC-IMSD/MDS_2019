import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JsonKeysPipe} from './json-keys.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [JsonKeysPipe ],
  providers:[],
  exports:[JsonKeysPipe]
})
export class MainPipeModule {

}
