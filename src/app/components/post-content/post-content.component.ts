/**
 * Zobrazí aktivní post (text, hlasující)
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Discussion } from '@hiveio/dhive';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { ActiveVotesModel } from 'src/app/models/activeVotesModel';

@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.css']
})
export class PostContentComponent implements OnChanges {

  md = new Remarkable({ html: true, linkify: true }).use(linkify);

  @Input()
  selectedPost!: Discussion;

  @Input()
  selectedActiveVotes: ActiveVotesModel[] = [];

  showTypeData = "body";

  selectedbody = "";

  tags = [];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.tags = JSON.parse(this.selectedPost.json_metadata).tags;
    //console.log(this.tags);
    this.selectedbody = this.md.render(this.selectedPost.body.replace(/pull-left/g, 'float-start').replace(/pull-right/g, 'float-end'));
  }

  clickChangeShowData(showTypeData:string) {
    this.showTypeData = showTypeData;
  }

  

}
