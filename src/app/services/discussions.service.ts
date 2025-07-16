/**
 * Načte seznam diskuzí
 */
import { Injectable } from '@angular/core';
import { Client, Discussion } from "@hiveio/dhive";
import { AuthorSortModel } from '../models/authorSortModel';
import { DatesModel } from '../models/datesModel';
import { PagesModel } from '../models/pagesModel';
import { ParameterFilter } from '../models/parameterFilter';
import { PostsModel } from '../models/postsModel';
import { SettingsModel } from '../models/settingsModel';
import { PropertiesService } from './properties.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  client = new Client("https://api.hive.blog");
  postsModel: PostsModel;
  private loadPostsSubject = new BehaviorSubject<number>(0);
  loadPosts$ = this.loadPostsSubject.asObservable();//počet načtených postů
  private loadHistorySubject = new BehaviorSubject<number>(0);
  loadHistory$ = this.loadHistorySubject.asObservable();//počet dní, které se načetly
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();
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
  rows = 10; //počet řádků na jedné stránce
  settings!: SettingsModel;
  query = {
    tag: 'cesky', // This tag is used to filter the results by a specific post tag
    limit: 20,
    start_author: '',
    start_permlink: '',
  };


  constructor(properties: PropertiesService) {
    this.postsModel = new PostsModel();
    const pr1 = properties.getDynamicGlobalProperties().then(result => this.postsModel.dynamicGlobalProperties = result);
    const pr2 = properties.getMedianHistoryPrice().then(result => this.postsModel.price = result);
    const pr3 = properties.getRewardFund().then(result => this.postsModel.rewardFund = result);

    Promise.all([pr1, pr2, pr3]).then(result => {
      //let rshare = 1106385407406;
      //let vysledek = rshare / this.postsModel.rewardFund.recent_claims * properties.convertHiveToNumber(this.postsModel.rewardFund.reward_balance) * this.postsModel.price.base.amount;
      //console.log(vysledek);
    });
  }


  /**
   * Zavolá promisu na sestavení diskuze (postů do pole)
   * @returns Pole s diskuzí (posty)
   */
  discussions(filter: ParameterFilter, settings: SettingsModel): Promise<PostsModel> {
    this.settings = settings;
    this.loadPostsSubject.next(0);//počet načtených postů
    this.loadHistorySubject.next(0);//počet dní, které se načítaly
    this.actualDate = new Date();
    this.lastDate = new Date();
    this.client = new Client(settings.node);

    //vymazání případných hodnot z předchozího hledání
    this.postsModel.posts.splice(0, this.postsModel.posts.length);
    this.query.tag = filter.tag.trim().toLocaleLowerCase();
    this.query.start_author = '';
    this.query.start_permlink = '';
    
    //načítání hodnoot z nastavení
    if (settings.loadPosts >= 1 && settings.loadPosts <= 20) {
      this.query.limit = settings.loadPosts;
    }
    else {
      this.query.limit = 20;
      this.settings.loadPosts = 20;
      localStorage.setItem('loadPosts', '20');
    }
    this.rows = settings.rows;
;
    this.lastDate.setDate(this.actualDate.getDate() - settings.days - 7);
    return new Promise((resolve) => {
      this.discussionsBuilder(resolve, filter);
    });
  }


  /**
   * Zavolá promisu na sestavení diskuze (postů do pole) - připojí jej ke stávajícímu
   * @returns Pole s diskuzí (posty) bude připojeno k již stávajícímu
   */
  discussionContinue(filter: ParameterFilter, settings: SettingsModel): Promise<PostsModel> {
    this.settings = settings;
    return new Promise((resolve) => {
      this.discussionsBuilder(resolve, filter);
    });
  }


  /** 
  * Sestaví dotaz na seznam diskuzí a pokračuje dokud datumy diskuzí budou v datumové mezi
  * Sestaví pole diskuzí (postů) 
  */
  private discussionsBuilder(resolve: any, filter: ParameterFilter) {

    this.getDiscussions()
      .then(result => {
        this.postsModel.posts = this.postsModel.posts.concat(result);
        this.loadPostsSubject.next(this.postsModel.posts.length);//aktualizace počtu načtených postů
        let lastIndexPost = this.postsModel.posts.length - 1;
        this.query.start_author = this.postsModel.posts[lastIndexPost].author;
        this.query.start_permlink = this.postsModel.posts[lastIndexPost].permlink;
        //podmínka opětovného načítání, když je datum větší než nastavená mez, nebo dokud je stejně postů jako je nastavený limit
        this.loadHistorySubject.next(Math.round(((new Date().getTime()) - (new Date(this.postsModel.posts[lastIndexPost].created).getTime())) / (1000 * 60 * 60 * 24)));
        if (new Date(this.postsModel.posts[lastIndexPost].created).getTime() >= this.lastDate.getTime() && result.length == this.query.limit && this.postsModel.posts.length < this.settings.maxPosts) {
          this.discussionsBuilder(resolve, filter);
        } else {
          this.parsePosts(resolve, filter);
        }
        if (this.postsModel.posts.length >= this.settings.maxPosts) {
          console.log("dosaženo limitu");
        }
      })
      .catch(err => {
        console.log(err);
        this.errorSubject.next('ErrorLoadingData');
      });
  }


  /**
   * Rozdělí načtené pole s posty podle kritéria ve filtru na pole polí
   * @param resolve  
   * @param filter 
   */
  private parsePosts(resolve: any, filter: ParameterFilter) {
    let index = 0;//inicializace prvního indexu pole
    let items = 30; //počet zobrazených položek// při týdenním děleno 7 a zaokrouhleno nahoru
    let isFistDate = true; //nastavení první skupiny záznamů, který budou mít aktuální datum a čas
    this.postsModel.init();

    let periodTime = new Date();

    periodTime.setHours(Number.parseInt(filter.time.substr(0, 2)));
    periodTime.setMinutes(Number.parseInt(filter.time.substr(3, 2)));
    periodTime.setSeconds(1);//nastavení výchozího intervalu jedně vteřiny
    periodTime.setMilliseconds(0);
    if (periodTime.getTime() > new Date().getTime())
      periodTime.setDate(periodTime.getDate() - 1);
    if (filter.interval === "tyden") {
      //nastavení na týdenní interval
      while (periodTime.getDay() != Number(filter.day)) {
        periodTime.setDate(periodTime.getDate() - 1);
      }
      items = Math.ceil((this.settings.days / 7) + 1);
    } else {
      items = this.settings.days;
    }
    if (periodTime.getHours() === 0)
      periodTime.setDate(periodTime.getDate() - 1);


    while (index < items) {
      //sestavení intervalů s datumy
      let dates = new DatesModel(new Date(periodTime), filter.getInterval(), isFistDate);
      this.postsModel.dates[index] = dates;
      periodTime.setDate(periodTime.getDate() - filter.getInterval());
      isFistDate = false;

      //roztřídění postů
      this.postsModel.postsSorted[index] = this.postsModel.posts.filter(
        post => (new Date(post.created).getTime() < new Date(this.postsModel.dates[index].dateUntilAsDateUTC).getTime())
          && (new Date(post.created).getTime() > new Date(this.postsModel.dates[index].dateFromAsDateUTC).getTime())
      );

      //roztřídění podle autorů
      this.postsModel.postsAuthor[index] = [];
      for (let i = 0; i < this.postsModel.postsSorted[index].length; i++) {
        let post = this.postsModel.postsSorted[index][i];
        let author = this.postsModel.postsAuthor[index].find(o => o.author === post.author);

        if (author) {
          author.add(post.children, post.active_votes.length, this.postsModel.negativeVotes(post), post.pending_payout_value.toString(), post.total_payout_value.toString());
        } else {
          this.postsModel.postsAuthor[index].push(new AuthorSortModel(post.author, post.children, post.active_votes.length, this.postsModel.negativeVotes(post), post.pending_payout_value.toString(), post.total_payout_value.toString()));
        }
      }

      //záznam o stránkování
      this.postsModel.actualView.actualViewPosts.push(new PagesModel());
      this.postsModel.actualView.actualViewAuthors.push(new PagesModel());
      this.postsModel.actualView.rowsPages = this.settings.rows;
      index++;
    }


    this.postsModel.counts();
    this.byCreate = -1;
    this.sortByCreate();

    //let votes: any[] = [];

    this.postsModel.postsSorted.forEach((posts: Discussion[], i: number) => {
      this.postsModel.actualView.actualViewPosts[i].totalItems = posts.length;

      /*posts.forEach((post: Discussion) => {
        console.log(post.author + " " + i);
        if (votes[i]) 
          votes[i].push(post.active_votes);
        else {
          votes[i] = [];
          votes[i] = post.active_votes;
        }
      });*/
    });

    this.postsModel.postsAuthor.forEach((authors: AuthorSortModel[], i: number) => {
      this.postsModel.actualView.actualViewAuthors[i].totalItems = authors.length;
    });

    this.postsModel.postsAuthor.forEach((authors: AuthorSortModel[], i: number) => {
      authors.forEach((author: AuthorSortModel) => {
        this.postsModel.postsSorted[i].forEach((post: Discussion) => {
          post.active_votes.find(act_votes => {
            if (author.author === act_votes.voter) {

              if (author.author === post.author)
                author.addSelfVote();
              else
                author.addVoteGiven();
            }
          });

        });

      });

    });

    resolve(this.postsModel);
  }


  /**
  * Dotaz na seznam diskuzí
  */
  private getDiscussions(): Promise<Discussion[]> {

    return this.client.database.getDiscussions('created', this.query);
  }


  /**
   * Převede textové číslo s příponou na typ number
   * @param s 
   * @returns 
   */
  private convertHBDToNumber(s: any): number {
    return Number(s.toString().replace("HBD", ""));
  }


  sortByAuthor(sort?: number) {
    if (sort)
      this.byAuthor = sort;
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.author > b.author ? (-1 * this.byAuthor) : a.author < b.author ? (1 * this.byAuthor) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.author > b.author ? (-1 * this.byAuthor) : a.author < b.author ? (1 * this.byAuthor) : 0);
    }
    this.byAuthor *= -1;
    return this.postsModel;
  }


  sortByCreate(sort?: number) {
    if (sort)
      this.byCreate = sort;
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.created < b.created ? (-1 * this.byCreate) : a.created > b.created ? (1 * this.byCreate) : 0);
    }
    this.byCreate *= -1;
    return this.postsModel;
  }


  sortByTitle(sort?: number) {
    if (sort)
      this.byTitle = sort;
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.title > b.title ? (-1 * this.byTitle) : a.title < b.title ? (1 * this.byTitle) : 0);
    }
    this.byTitle *= -1;
    return this.postsModel;
  }


  sortByPending(sort?: number) {
    if (sort)
      this.byPending = sort;
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


  sortByPayout(sort?: number) {
    if (sort)
      this.byPayout = sort;
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


  sortByChildren(sort?: number) {
    if (sort)
      this.byChildren = sort;
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.children < b.children ? (-1 * this.byChildren) : a.children > b.children ? (1 * this.byChildren) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.comments < b.comments ? (-1 * this.byChildren) : a.comments > b.comments ? (1 * this.byChildren) : 0);
    }
    this.byChildren *= -1;
    return this.postsModel;
  }


  sortByActiveVotes(sort?: number) {
    if (sort)
      this.byActiveVotes = sort;
    for (let i = 0; i < this.postsModel.postsSorted.length; i++) {
      this.postsModel.postsSorted[i].sort((a: Discussion, b: Discussion) => a.active_votes.length < b.active_votes.length ? (-1 * this.byActiveVotes) : a.active_votes.length > b.active_votes.length ? (1 * this.byActiveVotes) : 0);
    }
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.votes < b.votes ? (-1 * this.byActiveVotes) : a.votes > b.votes ? (1 * this.byActiveVotes) : 0);
    }
    this.byActiveVotes *= -1;
    return this.postsModel;
  }


  sortByPosts(sort?: number) {
    if (sort)
      this.byPost = sort;
    for (let i = 0; i < this.postsModel.postsAuthor.length; i++) {
      this.postsModel.postsAuthor[i].sort((a: AuthorSortModel, b: AuthorSortModel) => a.posts < b.posts ? (-1 * this.byPost) : a.posts > b.posts ? (1 * this.byPost) : 0);
    }
    this.byPost *= -1;
    return this.postsModel;
  }

}
