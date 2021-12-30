import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Discussion } from '@hiveio/dhive';
import { BarComponent } from './components/bar/bar.component';
import { ModalLoadBarComponent } from './components/modalLoadBar/modalLoadBar.component';
import { DateFormat } from './models/dateFormat';
import { PostsModel } from './models/postsModel';
import { HiveService } from './services/discussions.service';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Tag';

  postsModel!: PostsModel;

  dateFormat = new DateFormat();

  showLoadBar = false;

  showData = "post";

  isModalClosed = true;

  selectedPost!: Discussion;

  md = new Remarkable({ html: true }).use(linkify);

  selectedBody = "";

  @ViewChild(BarComponent, { static: false })
  private barComponentRef!: BarComponent;

  @ViewChild(ModalLoadBarComponent, { static: false })
  private modalLoadBarRef!: ModalLoadBarComponent;


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
      });

  }

  clickAuthor() {
    this.postsModel = this.hiveService.sortByAuthor();
  }

  clickCreate() {
    this.postsModel = this.hiveService.sortByCreate();
  }

  clickTitle() {
    this.postsModel = this.hiveService.sortByTitle();
  }

  clickPending() {
    this.postsModel = this.hiveService.sortByPending();
  }

  clickPayout() {
    this.postsModel = this.hiveService.sortByPayout();
  }

  clickChildren() {
    this.postsModel = this.hiveService.sortByChildren();
  }

  clickActiveVotes() {
    this.postsModel = this.hiveService.sortByActiveVotes();
  }

  clickPost() {
    this.postsModel = this.hiveService.sortByPosts();
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
}
