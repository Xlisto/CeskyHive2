/**
 * Načte seznam aktivních hlasujících u jednotlivého postu
 */
import { Injectable } from '@angular/core';
import { Client, Price } from '@hiveio/dhive';
import { ActiveVotesModel } from '../models/activeVotesModel';
import { CurrentRevardFundModel } from '../models/currentRewardFundModel';
import { PropertiesService } from './properties.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveVotesService {

  client = new Client("https://api.hive.blog");

  price!: Price;

  currentRewardFunds!: CurrentRevardFundModel;

  constructor(private readonly properties: PropertiesService) {
    properties.getMedianHistoryPrice()
      .then(result => this.price = result)
      .catch(error => console.error(error)
      );
    this.properties.getRewardFund()
      .then(result => this.currentRewardFunds = result)
      .catch(error => console.log(console.error(error)));
  }

  /**
   * Upraví sezna aktivních hlasujcích pro zobrazení výsledných hodnot
   * @param author 
   * @param permlink 
   * @returns 
   */
  activeVoteListBuilder(author: string, permlink: string): Promise<ActiveVotesModel[]> {
    let activeVotesList: ActiveVotesModel[] = [];
    this.activeVotes(author, permlink)
      .then(result => {
        for (let activeVote of result) {
          activeVotesList.push(new ActiveVotesModel(activeVote.percent, activeVote.reputation, activeVote.rshares, activeVote.time, activeVote.voter, this.price, this.currentRewardFunds));
        }
      }); this.client
    return new Promise(resolve => resolve(activeVotesList));
  }

  /**
   * Seznam aktivních hlasujících
   * @param author 
   * @param permlink 
   * @returns 
   */
  activeVotes(author: string, permlink: string): Promise<any> {
    return this.client.call('condenser_api', 'get_active_votes', [author, permlink]);

  }
}
