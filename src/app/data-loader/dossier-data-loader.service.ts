import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
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
      const rawList = await this.getRegistrarJSON();
      this._registrarList = this._convertListText(rawList, lang);
    }
    return (this._registrarList);

  }

  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  private _convertListText(rawList, lang) {
    const result = [];
    if (lang === GlobalsService.FRENCH) {
      rawList.forEach(item => {
        item.text = item.fr;
        result.push(item);
        //  console.log(item);
      });
    } else {
      rawList.forEach(item => {
        item.text = item.en;
        // console.log("adding country"+item.text);
        result.push(item);
        // console.log(item);
      });
    }
    return result;
  }

}
