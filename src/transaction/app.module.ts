import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ValidationService} from '../app/validation.service';
import {ErrorModule} from '../app/error-msg/error-ui.module';
import {TransactionBaseComponent} from '../app/transaction-base/transaction-base.component';
import {MainPipeModule} from '../app/main-pipe/main-pipe.module';
import {GlobalsService} from '../app/globals/globals.service';
import {TransactionDetailsComponent} from '../app/transaction-details/transaction.details.component';
import {TransactionHelpEnComponent} from '../app/transaction-help-en/transaction-help-en.component';
import {TransactionFeeComponent} from '../app/transaction-fee/transaction.fee.component';
import {RequesterModule} from '../app/requester/requester.module';
import {FileIoModule} from '../app/filereader/file-io/file-io.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonFeatureModule} from '../app/common/common-feature.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataLoaderModule} from '../app/data-loader/data-loader.module';
import {TransactionDataLoaderService} from '../app/data-loader/transaction-data-loader.service';

@NgModule({
  declarations: [
    AppComponent,
    TransactionDetailsComponent,
    TransactionFeeComponent,
    TransactionBaseComponent,
    TransactionHelpEnComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    RequesterModule,
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
    TransactionDataLoaderService,
    Title
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
  return new TranslateHttpLoader(http, './assets/i18n/transaction/', '.json');
}
