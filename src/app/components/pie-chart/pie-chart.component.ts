import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { EChartsOption, getInstanceByDom } from 'echarts';
import * as echarts from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
//import * as echarts from 'echarts/types/dist/echarts';
//import * as echarts from 'echarts/core';
import { DiscussionService } from 'src/app/services/discussions.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input()
  index = 0;

  chartOptionAuthor: EChartsOption = {};
  chartOptionComments: EChartsOption = {};

  constructor(private readonly hiveService: DiscussionService, private elRef: ElementRef) { }

  ngOnInit(): void {
    let authors: { value: number; name: string; }[] = [];
    let comments: { value: number; name: string; }[] = [];
    this.hiveService.postsModel.postsAuthor[this.index].forEach(author => {
      authors.push({ value: author.posts, name: author.author });
      comments.push({ value: author.comments, name: author.author });
    });


    this.chartOptionAuthor = {
      title: { text: "Napsané posty", subtext: "", left: "center" },
      tooltip: { trigger: 'item' },
      series: [{
        name: "Napsané posty", type: "pie", radius: "60%",
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
      title: { text: "Obdržené komentáře", subtext: "", left: "center" },
      tooltip: { trigger: 'item' },
      series: [{
        name: "Napsané komentáře", type: "pie", radius: "60%",
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
