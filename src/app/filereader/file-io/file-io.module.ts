import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilereaderComponent} from './filereader/filereader.component';
import {FileIoGlobalsService} from './file-io-globals.service';
import {ConvertResults} from './convert-results';
import {FileConversionService} from './file-conversion.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FilereaderComponent
  ],
  exports: [
    FilereaderComponent
  ],
  providers: [
    ConvertResults,
    FileConversionService,
    FileIoGlobalsService
  ]
})
export class FileIoModule {
}
