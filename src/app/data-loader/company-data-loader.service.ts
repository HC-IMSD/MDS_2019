import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GlobalsService} from '../../../common/app/globals/globals.service';

@Injectable()
export class CompanyDataLoaderService {

  private _rawCountryList = [];
  private _langCountries = [];

  constructor(private http: HttpClient) {
    /* this.getJSON().subscribe(data => {
       console.log(data);
       this._rawCountryList=data;
     });*/
  }

  async getJSON(): Promise<any> {
    // TODO hardcoded path fix?
    const response = await this.http.get('./assets/data/countries.json').toPromise();
    return response;
  }

  async getCountries(lang) {

    this._rawCountryList = await this.getJSON();
    if (!this._langCountries || this._langCountries.length == 0) {
      this._convertCountryList(lang);
    }
    return (this._langCountries);

  }

  /*  async getPrice(currency: string): Promise<number> {
      const response = await this.http.get(this.currentPriceUrl).toPromise();
      return response.json().bpi[currency].rate;
    }*/


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
