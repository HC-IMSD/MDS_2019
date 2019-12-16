import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalsService} from '../globals/globals.service';

@Injectable()
export class TransactionDataLoaderService {

  private _requesterList = [];
  private usersJsonPath = GlobalsService.DATA_PATH + 'users.json';

  constructor(private http: HttpClient) {
  }

  async getRequesterJSON(): Promise<any> {
    const response = await this.http.get(this.usersJsonPath).toPromise();
    return response;
  }

  async getRequesters(lang) {
    if (!this._requesterList || this._requesterList.length === 0) {
      const rawList = await this.getRequesterJSON();
      this._requesterList = this._convertListText(rawList, lang);
    }
    return (this._requesterList);

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
