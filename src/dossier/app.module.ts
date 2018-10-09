import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ValidationService} from '../app/validation.service';
import {ErrorModule} from '../app/error-msg/error-ui.module';
import {DossierBaseComponent} from '../app/dossier-base/dossier-base.component';
import {MainPipeModule} from '../app/main-pipe/main-pipe.module';
import {GlobalsService} from '../app/globals/globals.service';
import {DossierInfoComponent} from '../app/dossier-info/dossier.info.component';
import {DossierDetailsComponent} from '../app/dossier-details/dossier.details.component';
import {FileIoModule} from '../app/filereader/file-io/file-io.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonFeatureModule} from '../app/common/common-feature.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataLoaderModule} from '../app/data-loader/data-loader.module';
import {DossierDataLoaderService} from '../app/data-loader/dossier-data-loader.service';

@NgModule({
  declarations: [
    AppComponent,
    DossierInfoComponent,
    DossierDetailsComponent,
    DossierBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    MainPipeModule,
    FileIoModule,
    HttpClientModule,
    CommonFeatureModule,
    DataLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot()
  ],
  providers: [
    ValidationService,
    GlobalsService,
    DossierDataLoaderService
  ],
  exports: [
    TranslateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}


export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/dossier/', '.json');
}
