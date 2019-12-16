import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalsService} from '../globals/globals.service';

@Injectable()
export class CompanyDataLoaderService {

  private _rawCountryList = [];
  private _langCountries = [];
  private _langProvinces = [];
  private _langStates = [];
  private countryJsonPath = GlobalsService.DATA_PATH + 'countries.json';
  private provinceJsonPath = GlobalsService.DATA_PATH + 'provinces.json';
  private stateJsonPath = GlobalsService.DATA_PATH + 'states.json';

  constructor(private http: HttpClient) {
    /* this.getJSON().subscribe(data => {
       console.log(data);
       this._rawCountryList=data;
     });*/
  }

  async getCountryJSON(): Promise<any> {
    const response = await this.http.get(this.countryJsonPath).toPromise();
    return response;
  }

  async getCountries(lang) {
    if (!this._langCountries || this._langCountries.length === 0) {
      this._rawCountryList = await this.getCountryJSON();
      this._convertCountryList(lang);
    }
    return (this._langCountries);

  }

  async getProvincesJSON(): Promise<any> {
    const response = await this.http.get(this.provinceJsonPath).toPromise();
    return response;
  }

  async getProvinces(lang) {
    if (!this._langProvinces || this._langProvinces.length === 0) {
      const rawList = await this.getProvincesJSON();
      this._langProvinces = this._convertListText(rawList, lang);
    }
    return (this._langProvinces);

  }

  async getStatesJSON(): Promise<any> {
    const response = await this.http.get(this.stateJsonPath).toPromise();
    return response;
  }

  async getStates(lang) {
    if (!this._langStates || this._langStates.length === 0) {
      const rawList = await this.getStatesJSON();
      this._langStates  = this._convertListText(rawList, lang);
    }
    return (this._langStates);

  }

  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param lang
   * @private
   */
  private _convertCountryList(lang) {
    if (lang === GlobalsService.FRENCH) {
      this._rawCountryList.forEach(item => {
        item.text = item.fr;
        this._langCountries.push(item);
        //  console.log(item);
      });
    } else {
      this._rawCountryList.forEach(item => {
        item.text = item.en;
        // console.log("adding country"+item.text);
        this._langCountries.push(item);
        // console.log(item);
      });
    }
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
