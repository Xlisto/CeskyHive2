/**
 * Graf statistiky hlasování autorů
 */

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DiscussionService } from 'src/app/services/discussions.service';

@Component({
  selector: 'app-votes-chart',
  templateUrl: './votes-chart.component.html',
  styleUrls: ['./votes-chart.component.css']
})
export class VotesChartComponent implements OnInit {

  @Input()
  index = 0;

  option = {};

  constructor(private readonly hiveService: DiscussionService, public translate: TranslateService) { }

  ngOnInit(): void {
    let authorNames: string[] = [];
    let authorPosts: number[] = [];
    let authorVoteGiven: number [] = [];
    let authorSelfVote: number []  =[];
    let posts = "Posty";
    let votesDistributed = "Rozdané hlasy";
    let ownVotes = "Vlastní hlasy";

    if(this.translate.currentLang === 'en'){
      posts = 'Posts';
      votesDistributed = 'Votes distributed';
      ownVotes = 'Own Votes';
    }


    this.hiveService.postsModel.postsAuthor[this.index].forEach(author => {
      authorNames.push(author.author);
      authorPosts.push(author.posts);
      authorVoteGiven.push(author.voteGiven);
      authorSelfVote.push(author.selfVote);
    });
    
    let labelOption = "labeloption";
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: [posts, votesDistributed, ownVotes]
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        right: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: false, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: authorNames,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 20,
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      grid: { bottom: 100, left:30, right: 100},
      dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
            
        },
        {
            id: 'dataZoomY',
            type: 'slider',
            yAxisIndex: [0],
            filterMode: 'empty',
            right: 50
        }
    ],
      series: [
        {
          name: posts,
          type: 'bar',
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: authorPosts
        },
        {
          name: votesDistributed,
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: authorVoteGiven
        },
        {
          name: ownVotes,
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: authorSelfVote
        }
      ]
    };
    
  }

}
