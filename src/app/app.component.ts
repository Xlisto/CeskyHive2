import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Discussion, Price } from '@hiveio/dhive';
import { BarComponent } from './components/bar/bar.component';
import { ModalLoadBarComponent } from './components/modalLoadBar/modalLoadBar.component';
import { DateFormat } from './models/dateFormat';
import { PostsModel } from './models/postsModel';
import { DiscussionService } from './services/discussions.service';
import { TotalChartComponent } from './components/charts/total-chart/total-chart.component';
import { ActiveVotesService } from './services/active-votes.service';
import { ActiveVotesModel } from './models/activeVotesModel';
import { PropertiesService } from './services/properties.service';
import { CurrentRevardFundModel } from './models/currentRewardFundModel';
import { SettingsComponent } from './components/settings/settings.component';
import { NextLoadComponent } from './components/next-load/next-load.component';
import { ClipboardButtonComponent } from './components/cliboard-button/clipboard-button.component';
import { AlertComponent } from './components/alert/alert.component';
import { ModalComponent } from './components/modal/modal.component';
import { PostContentComponent } from './components/post-content/post-content.component';
import { FooterComponent } from './components/footer/footer.component';
import { VotesChartComponent } from './components/charts/votes-chart/votes-chart.component';
import { AuthorsChartComponent } from './components/charts/authors-chart/authors-chart.component';
import { PagesButtonsComponent } from './components/pages-buttons/pages-buttons.component';
import { ItemTotalComponent } from './components/item-total/item-total.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    BarComponent,
    ModalLoadBarComponent,
    TotalChartComponent,
    SettingsComponent,
    NextLoadComponent,
    ClipboardButtonComponent,
    AlertComponent,
    ModalComponent,
    PostContentComponent,
    FooterComponent,
    VotesChartComponent,
    AuthorsChartComponent,
    PagesButtonsComponent,
    ItemTotalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'HiveTags';

  postsModel!: PostsModel;

  currentRewardFunds!: CurrentRevardFundModel;

  price!: Price;

  showLoadBar = false;

  showData = "post";

  isModalPostClosed = true;

  isModalSettingsClosed = true;

  isModalNextLoadClosed = true;

  isMaxLoadPosts = false;//kontrola načtení maximálního povolého počtu načtených postů; def = 10000

  public isLoadingData = false;

  public showMagnifyingGlass = true;

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

  rows = 5;

  items = 1;//počet dní/týdnů ve výsledku

  node = "https://api.hive.blog";

  showPayout = true;

  showComment = true;

  showVote = true;

  maxPosts = 10000;

  alertClose = true;

  @ViewChild(BarComponent, { static: false })
  private barComponentRef!: BarComponent;

  @ViewChild(ModalLoadBarComponent, { static: false })
  private modalLoadBarRef!: ModalLoadBarComponent;

  // Error dialog state
  public showError = false;
  public errorMsg = '';
  @ViewChild(TotalChartComponent, { static: false })
  private totalChartRef!: TotalChartComponent;

  @ViewChild(SettingsComponent, { static: false })
  public settingsRef!: SettingsComponent;

  @ViewChild(NextLoadComponent, { static: false })
  public nextLoadRef!: NextLoadComponent;

  @ViewChild(AlertComponent, { static: false })
  public alertRef!: AlertComponent;

  constructor(
    private readonly discussionService: DiscussionService,
    private readonly activeVotesService: ActiveVotesService,
    private readonly properties: PropertiesService,
    public readonly dateFormat: DateFormat
  ) { }

  ngAfterViewInit(): void {
    this.properties.getRewardFund()
      .then(result => this.currentRewardFunds = result)
      .catch(error => console.log(console.error(error)));
    this.properties.getMedianHistoryPrice()
      .then(result => this.price = result)
      .catch(error => console.log(console.error(error)));
    this.discussionService.error$.subscribe(msg => {
      if (msg) {
        // Zavři progressbar dialog
        this.isLoadingData = false;
        this.showLoadBar = false;
        this.showMagnifyingGlass = true;
        console.error(msg);
        // Zobraz výstražný dialog s výzvou
        this.showErrorDialog(msg);
      }
    });
  }

  /**
   * Načte první sadu postů, zobrazí loadbar
   */
  load() {
    if (!this.isLoadingData) {
      this.isLoadingData = true;
      this.showMagnifyingGlass = false;
      this.rows = this.settingsRef.settings.rows;
      this.items = this.settingsRef.settings.days;
      this.showPayout = this.settingsRef.settings.showPayout;
      this.showComment = this.settingsRef.settings.showComment;
      this.showVote = this.settingsRef.settings.showVote;
      this.maxPosts = this.settingsRef.settings.maxPosts;
      // Resetování modelu postů při novém hledání
      this.postsModel = new PostsModel();
      this.showLoadBar = true;
      const filter = this.barComponentRef.parameterFilter;
      this.discussionService.discussions(filter, this.settingsRef.settings)
        .then(result => {
          this.postsModel = result;
          this.clickCreate(-1);
        })
        .catch(e => console.log(e))
        .finally(() => {
          this.isLoadingData = false;
          this.showLoadBar = false;
          this.reloadGraph();
          this.selectSortArrow = this.sortArrows[0];
          if (this.postsModel.posts.length >= this.settingsRef.settings.maxPosts) {
            this.isMaxLoadPosts = true;
            this.isModalNextLoadClosed = false;
            this.maxPosts = this.settingsRef.settings.maxPosts;
          }
          else
            this.isMaxLoadPosts = false;
        });

      localStorage.setItem('tag', this.barComponentRef.parameterFilter.tag);
      localStorage.setItem('time', this.barComponentRef.parameterFilter.time);
      localStorage.setItem('interval', this.barComponentRef.parameterFilter.interval);
      localStorage.setItem('dayCount', this.barComponentRef.parameterFilter.dayCount.toString());
      localStorage.setItem('day', this.barComponentRef.parameterFilter.day);
      //this.selectSortType = this.sortTypes[0];
      let element = document.getElementsByClassName('accordion-body');
    }
  }

  /**
   * Načte další sadu postů
   */
  loadNextPosts() {
    this.isLoadingData = true;
    this.showLoadBar = true;
    this.isMaxLoadPosts = false;
    const filter = this.barComponentRef.parameterFilter;
    this.settingsRef.settings.maxPosts += this.nextLoadRef.addMaxPosts;
    this.discussionService.discussionContinue(filter, this.settingsRef.settings)
      .then(result => {
        this.postsModel = result;
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.isLoadingData = false;
        this.showLoadBar = false;
        this.reloadGraph();
        if (this.postsModel.posts.length >= this.settingsRef.settings.maxPosts) {
          this.isMaxLoadPosts = true;
          this.isModalNextLoadClosed = false;
          this.maxPosts = this.settingsRef.settings.maxPosts;
        }
        else
          this.isMaxLoadPosts = false;
      });
    this.isModalNextLoadClosed = true;
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


  /**přepínač mezi seznamem postů a seznamemn autorů*/
  clickChangeShowData(data: string) {
    this.showData = data;
    //console.log(data);
  }


  /**
   * Kliknutí na
   * @param post  
   */
  clickItem(post: Discussion) {
    this.activeVotesService.activeVoteListBuilder(post.author, post.permlink)
      .then(result => { this.selectedActiveVotes = result; })
      .catch(error => console.log(error)
      );
    this.selectedPost = post;
    this.isModalPostClosed = false;
  }


  /**
   * Aktualizace dat grafů
   */
  reloadGraph() {
    //console.log("reloadgraph");
    if (this.totalChartRef)
      this.totalChartRef.updateChart();
  }


  /**
   * Zobrazení grafů
   */
  showGraph() {
    if (this.visibleGraph)
      this.visibleGraph = false;
    else
      this.visibleGraph = true;
  }


  /**
   * Zobrazení dialogového okna s nastavením a načte nastavení z localstorage
   */
  showSettings() {
    this.settingsRef.initData();
    this.isModalSettingsClosed = false;
  }


  /**Uloží nastavení a zavře dialogové okno*/
  saveSettings() {
    if (this.settingsRef.settings)
      this.settingsRef.saveSettings();

    this.rows = this.settingsRef.settings.rows;
    this.items = this.settingsRef.settings.days;
    this.showPayout = this.settingsRef.settings.showPayout;
    this.showComment = this.settingsRef.settings.showComment;
    this.showVote = this.settingsRef.settings.showVote;
    this.isModalSettingsClosed = true;

    //nastavení stránky na první
    if (this.postsModel) {
      for (let pages of this.postsModel.actualView.actualViewPosts) {
        pages.actualView = 0;
        pages.actualPages = 1;
      }
      for (let pages of this.postsModel.actualView.actualViewAuthors) {
        pages.actualView = 0;
        pages.actualPages = 1;
      }
      this.postsModel.actualView.rowsPages = this.settingsRef.settings.rows;
    }
  }


  /**
   * Zavře dialogové okno nastavení
   */
  cancelSettings() {
    this.isModalSettingsClosed = true;
  }


  /**
   * Zavře okno s dotazem na další načtení postů
   */
  cancelNextLoad() {
    this.isModalNextLoadClosed = true;
  }


  /**
   * Nastaveníí třídění v mobilním zobrazení
   */
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

  test(x: any) {
    //console.log(this.totalChartRef);
    if (this.totalChartRef)
      this.totalChartRef.updateChart();
    //console.log(x);
  }

  /**
   * Zobrazí dialogové okno s chybou
   */
  showErrorDialog(msg: string) {
    this.errorMsg = msg;
    this.showError = true;
  }

  /**
   * Zavře dialogové okno s chybou
   */
  closeErrorDialog() {
    this.showError = false;
    this.errorMsg = '';
  }

}
