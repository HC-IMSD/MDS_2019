import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsService {
  public static errorSummClassName:string='ErrorSummaryComponent';
  public static errorSummleastOneRcd:string='leastOneRecordError';
  public static CANADA:string='CAN';
  public static USA:string='USA';
  public static DATA_PATH:string='./assets/data/';
  public static ENGLISH:string='en';
  public static FRENCH:string='fr';
  public static YES:string='yes';
  public static NO:string='no';
  public static YESNOList = [GlobalsService.YES, GlobalsService.NO];
  public static NEW:string='NEW';
  public static AMEND:string='AMEND';
  public static FINAL:string='FINAL';
  public static DEVICE_TYPE_EN:string='Medical Device';
  public static DEVICE_TYPE_FR:string='fr_Medical Device';
  public static STYLESHEETS_1_0_PREFIX  = '';
  // public static STYLESHEETS_1_0_PREFIX  = 'https://raw.githubusercontent.com/HealthCanada/HPFB/master/Medical-Device-REP/v_1_0/Style-Sheets/';
  public static SOFTWARE_VERSION: string = '2.0';
  constructor() { }

}
