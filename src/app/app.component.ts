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

  selectClickedColl = "created";

  public visibleGraph = false;

  md = new Remarkable({ html: true }).use(linkify);

  selectedBody = "";

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

  clickAuthor() {
    this.postsModel = this.hiveService.sortByAuthor();
    this.selectClickedColl = "author";
  }

  clickCreate() {
    this.postsModel = this.hiveService.sortByCreate();
    this.selectClickedColl = "created";
  }

  clickTitle() {
    this.postsModel = this.hiveService.sortByTitle();
    this.selectClickedColl = "title";
  }

  clickPending() {
    this.postsModel = this.hiveService.sortByPending();
    this.selectClickedColl = "pending";
  }

  clickPayout() {
    this.postsModel = this.hiveService.sortByPayout();
    this.selectClickedColl = "payout";
  }

  clickChildren() {
    this.postsModel = this.hiveService.sortByChildren();
    this.selectClickedColl = "children";
  }

  clickActiveVotes() {
    this.postsModel = this.hiveService.sortByActiveVotes();
    this.selectClickedColl = "votes";
  }

  clickPost() {
    this.postsModel = this.hiveService.sortByPosts();
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
    console.log("show graph"+this.visibleGraph);
    if (this.visibleGraph)
      this.visibleGraph = false;
    else
      this.visibleGraph = true;
  }
}
