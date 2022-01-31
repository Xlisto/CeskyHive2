import { Injectable } from '@angular/core';
import { Client, DynamicGlobalProperties, Price } from '@hiveio/dhive';
import { CurrentRevardFundModel } from '../models/currentRewardFundModel';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  client = new Client("https://api.hive.blog");

  constructor() {
    /*this.getDynamicGlobalProperties().then(result => console.log(result));
    this.getMedianHistoryPrice().then(result => console.log(result));
    this.getRewardFund().then(result => {
      console.log(result)
      //let rshare = 1109660607715;
      //let vysledek = rshare / result.recent_claims * this.convertHiveToNumber(result.reward_balance)*1.625;
      //console.log(vysledek);
    });*/
   }

  getDynamicGlobalProperties(): Promise<DynamicGlobalProperties> {
    return this.client.database.getDynamicGlobalProperties();
  }

  getMedianHistoryPrice(): Promise<Price> {
    return this.client.database.getCurrentMedianHistoryPrice();
  }

  getRewardFund(): Promise<CurrentRevardFundModel> {
    return this.client.database.call('get_reward_fund', ["post"]);
  }

  convertHiveToNumber(s: any): number {
    return Number(s.toString().replace("HIVE", ""));
  }
}
