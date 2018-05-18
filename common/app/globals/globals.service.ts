import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsService {
  public static errorSummClassName:string='ErrorSummaryComponent';
  public static CANADA:string='CAN';
  public static USA:string='USA';
  public static DATA_PATH:string='./assets/data/';
  public static ENGLISH:string='en';
  public static FRENCH:string='fr';

  constructor() { }

}
