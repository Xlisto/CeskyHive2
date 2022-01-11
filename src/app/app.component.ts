import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Discussion } from '@hiveio/dhive';
import { BarComponent } from './components/bar/bar.component';
import { ModalLoadBarComponent } from './components/modalLoadBar/modalLoadBar.component';
import { DateFormat } from './models/dateFormat';
import { PostsModel } from './models/postsModel';
import { HiveService } from './services/discussions.service';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import * as echarts from 'echarts';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'HiveTag';

  postsModel!: PostsModel;

  dateFormat = new DateFormat();

  showLoadBar = false;

  showData = "post";

  isModalClosed = true;

  selectedPost!: Discussion;

  public visibleGraph = false;

  md = new Remarkable({ html: true }).use(linkify);

  selectedBody = "";

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

  constructor(private readonly hiveService: HiveService) {
  }

  ngAfterViewInit(): void {

  }

  /**
   * Zobrazení průběhu načítání
   */
  load() {
    this.showLoadBar = true;
    const filter = this.barComponentRef.parameterFilter;
    this.hiveService.discussions(filter).then(result => {
      console.log(result);
      this.postsModel = result;
    }).catch(e => console.log(e))
      .finally(() => {
        this.showLoadBar = false;
        this.modalLoadBarRef.stopInterval();
        //this.lineChartRef.loadChart();
        this.reloadGraph();
      });

  }

  clickAuthor(sort?:number) {
    this.postsModel = this.hiveService.sortByAuthor(sort);
    this.selectClickedColl = "author";
    this.selectSortType = this.sortTypes[1];
  }

  clickCreate(sort?:number) {
    this.postsModel = this.hiveService.sortByCreate(sort);
    this.selectClickedColl = "created";
    this.selectSortType = this.sortTypes[0];
  }

  clickTitle(sort?:number) {
    this.postsModel = this.hiveService.sortByTitle(sort);
    this.selectClickedColl = "title";
    this.selectSortType = this.sortTypes[2];
  }

  clickPending(sort?:number) {
    this.postsModel = this.hiveService.sortByPending(sort);
    this.selectClickedColl = "pending";
    this.selectSortType = this.sortTypes[3];
  }

  clickPayout(sort?:number) {
    this.postsModel = this.hiveService.sortByPayout(sort);
    this.selectClickedColl = "payout";
    this.selectSortType = this.sortTypes[4];
  }

  clickChildren(sort?:number) {
    this.postsModel = this.hiveService.sortByChildren(sort);
    this.selectClickedColl = "children";
    this.selectSortType = this.sortTypes[5];
  }

  clickActiveVotes(sort?:number) {
    this.postsModel = this.hiveService.sortByActiveVotes(sort);
    this.selectClickedColl = "votes";
    this.selectSortType = this.sortTypes[6];
  }

  clickPost(sort?:number) {
    this.postsModel = this.hiveService.sortByPosts(sort);
    this.selectClickedColl = "post";
  }

  //přepínač mezi seznamem postů a seznamemn autorů
  clickChangeShowData(data: string) {
    this.showData = data;
    console.log(data);
  }

  clickItem(post: Discussion) {
    this.selectedPost = post;
    this.isModalClosed = false;
    this.selectedBody = this.md.render(post.body.replace(/pull-left/g, 'float-start').replace(/pull-right/g, 'float-end')
      //.replace(/<center>/g,'<div style=\"text-align: center;\">').replace(/<\/center>/g,'</div>')
    );
    //console.log(this.md.render(post.body));
    console.log(this.postsModel.negativeVotes(post));
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
