import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GlobalsService} from '../globals/globals.service';

@Injectable()
export class CompanyDataLoaderService {

  private _rawCountryList = [];
  private _langCountries = [];
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

    this._rawCountryList = await this.getCountryJSON();
    if (!this._langCountries || this._langCountries.length === 0) {
      this._convertCountryList(lang);
    }
    return (this._langCountries);

  }

  async getProvinces(): Promise<any> {
    const response = await this.http.get(this.provinceJsonPath).toPromise();
    return response;
  }

  async getStates(): Promise<any> {
    const response = await this.http.get(this.stateJsonPath).toPromise();
    return response;
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

}
