/**
 * Graf (koláčový) statistiky autorů
 */
import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateService } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';
import { DiscussionService } from 'src/app/services/discussions.service';

@Component({
  selector: 'app-authors-chart',
  standalone: true,
  imports: [TranslateModule, NgxEchartsModule],
  templateUrl: './authors-chart.component.html',
  styleUrls: ['./authors-chart.component.css']
})
export class AuthorsChartComponent implements OnInit {

  @Input()
  index = 0;

  chartOptionAuthor = {};
  chartOptionComments: EChartsOption = {};

  constructor(private readonly hiveService: DiscussionService, private elRef: ElementRef, public translate: TranslateService) { }

  ngOnInit(): void {
    let authors: { value: number; name: string; }[] = [];
    let comments: { value: number; name: string; }[] = [];
    let writenPosts = "Napsané posty";
    let commentsReceived = "Obdržené komentáře" 

    if(this.translate.currentLang === 'en')  {
      writenPosts = "Writen posts";
      commentsReceived = "Comments received";
    }

    this.hiveService.postsModel.postsAuthor[this.index].forEach(author => {
      authors.push({ value: author.posts, name: author.author });
      comments.push({ value: author.comments, name: author.author });
    });


    this.chartOptionAuthor = {
      title: { text: writenPosts, subtext: "", left: "center" },
      tooltip: { trigger: 'item' },
      toolbox: {
        show: true,
        orient: 'vertical',
        right: 'right',
        top: 'top',
        feature: {
          mark: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [{
        name: writenPosts, type: "pie", radius: "60%",
        data: authors,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };


    this.chartOptionComments = {
      title: { text: commentsReceived, subtext: "", left: "center" },
      tooltip: { trigger: 'item' },
      toolbox: {
        show: true,
        orient: 'vertical',
        right: 'right',
        top: 'top',
        feature: {
          mark: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [{
        name: commentsReceived, type: "pie", radius: "60%",
        data: comments,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };


  }



}
