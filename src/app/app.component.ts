import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Discussion, Price } from '@hiveio/dhive';
import { BarComponent } from './components/bar/bar.component';
import { ModalLoadBarComponent } from './components/modalLoadBar/modalLoadBar.component';
import { DateFormat } from './models/dateFormat';
import { PostsModel } from './models/postsModel';
import { DiscussionService } from './services/discussions.service';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { ActiveVotesService } from './services/active-votes.service';
import { ActiveVotesModel } from './models/activeVotesModel';
import { PropertiesService } from './services/properties.service';
import { CurrentRevardFundModel } from './models/currentRewardFundModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'HiveTag';

  postsModel!: PostsModel;

  dateFormat = new DateFormat();

  currentRewardFunds!: CurrentRevardFundModel;

  price!: Price;

  showLoadBar = false;

  showData = "post";

  isModalClosed = true;

  selectedPost!: Discussion;

  selectedActiveVotes!: ActiveVotesModel[];

  public visibleGraph = false;

  sortTypes = [
    { id: "create", type: "Vytvořeno" },
    { id: "author", type: "Autor" },
    { id: "title", type: "Nadpis" },
    { id: "pending", type: "Čekající" },
    { id: "payout", type: "Vyplaceno" },
    { id: "comment", type: "Komentáře" },
    { id: "vote", type: "Hlasy" }
  ];

  sortArrows = [
    { id: "-1", type: "Vzestupně" },
    { id: "1", type: "Sestupně" }
  ];

  selectClickedColl = "created";

  selectSortType = this.sortTypes[0];
  selectSortArrow = this.sortArrows[0];

  @ViewChild(BarComponent, { static: false })
  private barComponentRef!: BarComponent;

  @ViewChild(ModalLoadBarComponent, { static: false })
  private modalLoadBarRef!: ModalLoadBarComponent;

  @ViewChild(LineChartComponent, { static: false })
  private lineChartRef!: LineChartComponent;

  constructor(
    private readonly discussionService: DiscussionService,
    private readonly activeVotesService: ActiveVotesService,
    private readonly properties: PropertiesService) {


  }

  ngAfterViewInit(): void {
    this.properties.getRewardFund()
      .then(result => this.currentRewardFunds = result)
      .catch(error => console.log(console.error(error)));
    this.properties.getMedianHistoryPrice()
      .then(result => this.price = result)
      .catch(error => console.log(console.error(error)));
  }

  /**
   * Zobrazení průběhu načítání
   */
  load() {

    this.showLoadBar = true;
    const filter = this.barComponentRef.parameterFilter;
    this.discussionService.discussions(filter).then(result => {
      console.log(result);
      this.postsModel = result;
      this.clickCreate(-1);
    }).catch(e => console.log(e))
      .finally(() => {
        this.showLoadBar = false;
        this.modalLoadBarRef.stopInterval();
        //this.lineChartRef.loadChart();
        this.reloadGraph();
      });

    localStorage.setItem('tag', this.barComponentRef.parameterFilter.tag);
    localStorage.setItem('time', this.barComponentRef.parameterFilter.time);
    localStorage.setItem('interval', this.barComponentRef.parameterFilter.interval);
    localStorage.setItem('dayCount', this.barComponentRef.parameterFilter.dayCount.toString());
    localStorage.setItem('day', this.barComponentRef.parameterFilter.day);
    //this.selectSortType = this.sortTypes[0];
    this.selectSortArrow = this.sortArrows[0];
    
  }

  clickAuthor(sort?: number) {
    this.postsModel = this.discussionService.sortByAuthor(sort);
    this.selectClickedColl = "author";
    this.selectSortType = this.sortTypes[1];
  }

  clickCreate(sort?: number) {
    this.postsModel = this.discussionService.sortByCreate(sort);
    this.selectClickedColl = "created";
    this.selectSortType = this.sortTypes[0];
  }

  clickTitle(sort?: number) {
    this.postsModel = this.discussionService.sortByTitle(sort);
    this.selectClickedColl = "title";
    this.selectSortType = this.sortTypes[2];
  }

  clickPending(sort?: number) {
    this.postsModel = this.discussionService.sortByPending(sort);
    this.selectClickedColl = "pending";
    this.selectSortType = this.sortTypes[3];
  }

  clickPayout(sort?: number) {
    this.postsModel = this.discussionService.sortByPayout(sort);
    this.selectClickedColl = "payout";
    this.selectSortType = this.sortTypes[4];
  }

  clickChildren(sort?: number) {
    this.postsModel = this.discussionService.sortByChildren(sort);
    this.selectClickedColl = "children";
    this.selectSortType = this.sortTypes[5];
  }

  clickActiveVotes(sort?: number) {
    this.postsModel = this.discussionService.sortByActiveVotes(sort);
    this.selectClickedColl = "votes";
    this.selectSortType = this.sortTypes[6];
  }

  clickPost(sort?: number) {
    this.postsModel = this.discussionService.sortByPosts(sort);
    this.selectClickedColl = "post";
  }

  //přepínač mezi seznamem postů a seznamemn autorů
  clickChangeShowData(data: string) {
    this.showData = data;
    //console.log(data);
  }

  clickItem(post: Discussion) {
    this.activeVotesService.activeVoteListBuilder(post.author, post.permlink)
      .then(result => { console.log(result), this.selectedActiveVotes = result; })
      .catch(error => console.log(error)
      );
    //this.activeVotesService.activeVoteListBuilder(post.author, post.permlink).then(r => console.log(r));
    //this.activeVotesService.activeVoteListBuilder(post.author, post.permlink).then(result => console.log(result));
    this.selectedPost = post;
    this.isModalClosed = false;
    
    //console.log(this.md.render(post.body));
    //console.log(this.postsModel.negativeVotes(post));
    console.log(this.selectedPost);
  }

  /**
   * Aktualizace dat grafů
   */
  reloadGraph() {
    console.log("reloadgraph");
    if (this.lineChartRef)
      this.lineChartRef.updateChart();
  }

  showGraph() {
    console.log("show graph" + this.visibleGraph);
    if (this.visibleGraph)
      this.visibleGraph = false;
    else
      this.visibleGraph = true;
  }

  onChangeTypeSort() {
    console.log(this.selectSortType, this.selectSortArrow);
    let sort = Number(this.selectSortArrow.id);

    switch (this.selectSortType.id) {
      case 'create':
        this.clickCreate(sort);
        break;
      case 'author':
        this.clickAuthor(sort);
        break;
      case 'title':
        this.clickTitle(sort);
        break;
      case 'pending':
        this.clickPending(sort);
        break;
      case 'payout':
        this.clickPayout(sort);
        break;
      case 'comment':
        this.clickChildren(sort);
        break;
      case 'vote':
        this.clickActiveVotes(sort);
        break;
    }
  }


}
