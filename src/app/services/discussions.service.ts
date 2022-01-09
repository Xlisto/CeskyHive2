/**
 * Načte seznam diskuzí
 */
import { Injectable } from '@angular/core';
import { Client, Discussion, DynamicGlobalProperties } from "@hiveio/dhive";
import { AuthorSortModel } from '../models/authorSortModel';
import { DatesModel } from '../models/datesModel';
import { ParameterFilter } from '../models/parameterFilter';
import { PostsModel } from '../models/postsModel';
import { PropertiesService } from './properties.service';

@Injectable({
  providedIn: 'root'
})
export class HiveService {



  client = new Client("https://api.hive.blog");
  //client = new Client("https://api.openhive.network");
  postsModel: PostsModel;
  loadPosts = 0;//počet načtených postů
  byAuthor = 1;//nastavení směru třídění u autora
  byCreate = 1;
  byTitle = 1;
  byPending = 1;
  byPayout = 1;
  byChildren = 1;
  byActiveVotes = 1;
  byPost = 1;
  actualDate!: Date;
  lastDate!: Date;
  query = {
    tag: 'cesky', // This tag is used to filter the results by a specific post tag
    limit: 50, // This limit allows us to limit the overall results returned to 5
    start_author: '',
    start_permlink: '',
  };

  constructor(properties: PropertiesService) {
    this.postsModel = new PostsModel();
    const pr1 = properties.getDynamicGlobalProperties().then(result => this.postsModel.dynamicGlobalProperties = result);
    const pr2 = properties.getMedianHistoryPrice().then(result => this.postsModel.price = result);
    const pr3 = properties.getRewardFund().then(result => this.postsModel.rewardFund = result);

    Promise.all([pr1, pr2, pr3]).then(result => {
      let rshare = 1106385407406;
      let vysledek = rshare / this.postsModel.rewardFund.recent_claims * properties.convertHiveToNumber(this.postsModel.rewardFund.reward_balance) * this.postsModel.price.base.amount;
      console.log(vysledek);
    });

  }

  /**
   * Zavolá promisu na sestavení diskuze (postů do pole)
   * @returns Pole s diskuzí (posty)
   */
  discussions(filter: ParameterFilter): Promise<PostsModel> {
    //console.log(filter.tag);
    this.loadPosts = 0;//počet načtených postů
    this.actualDate = new Date();
    this.lastDate = new Date();
    this.lastDate.setDate(this.actualDate.getDate() - 28);
    //vymazání případných hodnot z předchozího hledání
    this.postsModel.posts = [];
    this.query.tag = filter.tag;
    this.query.start_author = '';
    this.query.start_permlink = '';
    return new Promise((resolve) => {
      this.discussionsBuilder(resolve, filter);
    });
  }

  /** 
  * Sestaví dotaz na seznam diskuzí a pokračuje dokud datumy diskuzí budou v datumové mezi
  * Sestaví pole diskuzí (postů) 
  */
  private discussionsBuilder(resolve: any, filter: ParameterFilter) {

    this.getDiscussions().then(result => {
      this.postsModel.posts = this.postsModel.posts.concat(result);
      this.loadPosts = this.postsModel.posts.length;
      let lastIndexPost = this.postsModel.posts.length - 1;
      this.query.start_author = this.postsModel.posts[lastIndexPost].author;
      this.query.start_permlink = this.postsModel.posts[lastIndexPost].permlink;
      //podmínka opětovného načítání, když je datum větší než nastavená mez, nebo dokud je stejně postů jako je nastavený limit
      if (new Date(this.postsModel.posts[lastIndexPost].created).getTime() >= this.lastDate.getTime() && result.length == this.query.limit) {
        this.discussionsBuilder(resolve, filter);
        //console.log(this.postsModel.posts[lastIndexPost].created);
      } else {
        this.parsePosts(resolve, filter);
      }
    }).catch(err => console.log(err));
  }

  /**
   * Rozdělí načtené pole s posty podle kritéria ve filtru na pole polí
   * @param resolve  
   * @param filter 
   */
  private parsePosts(resolve: any, filter: ParameterFilter) {
    let index = 0;//inicializace prvního indexu pole
    this.postsModel.postsSorted = [];//inicializace pole
    this.postsModel.postsSorted[index] = [];//inicializace pole na prvním indxu
    this.postsModel.postsAuthor = [[]];
    this.postsModel.totalCount = [];
    this.postsModel.dates = [];
    let today = new Date();
    today.setHours(Number.parseInt(filter.time.substr(0, 2)));
    today.setMinutes(Number.parseInt(filter.time.substr(3, 2)));
    today.setSeconds(1);//nastavení výchozího intervalu jedně vteřiny
    today.setMilliseconds(0);
    if (filter.interval === "tyden") {
      //nastavení na týdenní interval
      while (today.getDay() != Number(filter.day)) {
        today.setDate(today.getDate() - 1);
      }
    }
    if (today.getHours() === 0)
      today.setDate(today.getDate() - 1);
    today.setHours(today.getUTCHours());//převod z místního času na čas UTC - čas blockchainu
    today.setMinutes(today.getUTCMinutes());
    //today.setDate(today.getUTCDate());
    let isFistDate = true;
    for (let i = 0; i < this.postsModel.posts.length; i++) {

      const post = this.postsModel.posts[i];
      const datePost = new Date(post.created);
      var dates = new DatesModel(new Date(today), filter.getInterval(), isFistDate);
      this.postsModel.dates[index] = dates;

      if (new Date(post.created).getTime() < today.getTime()) {
        isFistDate = false;
        //pokud se předchozí pole ničím nenaplnilo, použije se znova
        if (this.postsModel.postsSorted[index].length > 0) {
          index++;
          this.postsModel.postsSorted[index] = [];
          this.postsModel.postsAuthor[index] = [];
        }
        today.setDate(today.getDate() - filter.getInterval());
        this.postsModel.dates[index] = dates;
      }
      this.postsModel.postsSorted[index].push(post);
      let obj = this.postsModel.postsAuthor[index].find(o => o.author === post.author);
      //console.log(obj);
      if (obj) {
        obj.add(post.children, post.active_votes.length, this.postsModel.negativeVotes(post), post.pending_payout_value.toString(), post.total_payout_value.toString());
      } else {
        this.postsModel.postsAuthor[index].push(new AuthorSortModel(post.author, post.children, post.active_votes.length, this.postsModel.negativeVotes(post), post.pending_payout_value.toString(), post.total_payout_value.toString()));
      }
    }
    //odebírám poslední položku pole, protože jsou neúplná
    this.postsModel.dates.pop();
    this.postsModel.postsSorted.pop();
    this.postsModel.postsAuthor.pop();
    this.postsModel.counts();
    resolve(this.postsModel);
  }

  /**
  * Dotaz na seznam diskuzí
  */
  private getDiscussions(): Promise<Discussion[]> {
    return this.client.database.getDiscussions('created', this.query);
  }

  private convertHBDToNumber(s: any): number {
    return Number(s.toString().replace("HBD", ""));
  }

  sortByAuthor() {
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.author < b.author ? (-1 * this.byAuthor) : a.author > b.author ? (1 * this.byAuthor) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.author < b.author ? (-1 * this.byAuthor) : a.author > b.author ? (1 * this.byAuthor) : 0);
    }
    this.byAuthor *= -1;
    return this.postsModel;
  }

  sortByCreate() {
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.created < b.created ? (-1 * this.byCreate) : a.created > b.created ? (1 * this.byCreate) : 0);
    }
    this.byCreate *= -1;
    return this.postsModel;
  }

  sortByTitle() {
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.title < b.title ? (-1 * this.byTitle) : a.title > b.title ? (1 * this.byTitle) : 0);
    }
    this.byTitle *= -1;
    return this.postsModel;
  }

  sortByPending() {
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) =>
        this.convertHBDToNumber(a.pending_payout_value) < this.convertHBDToNumber(b.pending_payout_value) ? (-1 * this.byPending) : this.convertHBDToNumber(a.pending_payout_value) > this.convertHBDToNumber(b.pending_payout_value) ? (1 * this.byPending) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) =>
        a.pendingPayoutValue < b.pendingPayoutValue ? (-1 * this.byPending) : a.pendingPayoutValue > b.pendingPayoutValue ? (1 * this.byPending) : 0);
    }
    this.byPending *= -1;
    return this.postsModel;
  }

  sortByPayout() {
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) =>
        this.convertHBDToNumber(a.total_payout_value) < this.convertHBDToNumber(b.total_payout_value) ? (-1 * this.byPayout) : this.convertHBDToNumber(a.total_payout_value) > this.convertHBDToNumber(b.total_payout_value) ? (1 * this.byPayout) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) =>
        a.totalPayoutValue < b.totalPayoutValue ? (-1 * this.byPayout) : a.totalPayoutValue > b.totalPayoutValue ? (1 * this.byPayout) : 0);
    }
    this.byPayout *= -1;
    return this.postsModel;
  }

  sortByChildren() {
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.children < b.children ? (-1 * this.byChildren) : a.children > b.children ? (1 * this.byChildren) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.comments < b.comments ? (-1 * this.byChildren) : a.comments > b.comments ? (1 * this.byChildren) : 0);
    }
    this.byChildren *= -1;
    return this.postsModel;
  }

  sortByActiveVotes() {
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.active_votes.length < b.active_votes.length ? (-1 * this.byActiveVotes) : a.active_votes.length > b.active_votes.length ? (1 * this.byActiveVotes) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.votes < b.votes ? (-1 * this.byActiveVotes) : a.votes > b.votes ? (1 * this.byActiveVotes) : 0);
    }
    this.byActiveVotes *= -1;
    return this.postsModel;
  }

  sortByPosts() {
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.posts < b.posts ? (-1 * this.byPost) : a.posts > b.posts ? (1 * this.byPost) : 0);
    }
    this.byPost *= -1;
    return this.postsModel;
  }

}
