import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GlobalsService} from '../globals/globals.service';

@Injectable()
export class DossierDataLoaderService {

  private _registrarList = [];
  private countryJsonPath = GlobalsService.DATA_PATH + 'registrars.json';

  constructor(private http: HttpClient) {
  }

  async getRegistrarJSON(): Promise<any> {
    const response = await this.http.get(this.countryJsonPath).toPromise();
    return response;
  }

  async getRegistrars(lang) {
    if (!this._registrarList || this._registrarList.length === 0) {
      this._registrarList = await this.getRegistrarJSON();
    }
    return (this._registrarList);

  }

}
