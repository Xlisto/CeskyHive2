/**
 * Graf celkové statistiky
 */

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';
import { DiscussionService } from 'src/app/services/discussions.service';

@Component({
  selector: 'app-total-chart',
  templateUrl: './total-chart.component.html',
  styleUrls: ['./total-chart.component.css']
})
export class TotalChartComponent implements AfterViewInit {

  private author = "author";
  private comment = "comment";
  private vote = "vote";
  private payout = "payout";

  nameAuthor = 'Author';
  namePost = 'Post';
  nameComments = "Comments";
  nameVotes = "Votes";
  namePayouts = "Payouts";
  namePendings = "Pendings";

  /**
   * Pro aktualizovaná data grafu
   */
  mergeAuthor!: EChartsOption;
  mergeComment!: EChartsOption;
  mergeVote!: EChartsOption;
  mergePayout!: EChartsOption;

  /**
   * Základní nastavení vlastností grafu
   */
  chartAuthor: EChartsOption = {
    grid: { left: "60px", right: "0px" },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => value.toLocaleString()
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      }
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
  };

  chartComment: EChartsOption = {
    grid: { left: "60px", right: "0px" },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => value.toLocaleString()
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      }
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
  };

  chartVote: EChartsOption = {
    grid: { left: "60px", right: "0px" },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => value.toLocaleString()
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      }
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
    color: ["#91cc75"],

  };

  chartPayout: EChartsOption = {
    grid: { left: "80px", right: "0px" },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => value.toLocaleString() + ' HBD'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        animation: true
      },
      formatter: function (params: any) {
        var colorSpan = (color: any) => '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + color + '"></span>';
        let rez = params[0].axisValue + '<br/>';
        //console.log(params); //quite useful for debug
        params.forEach((item: any) => {
          //console.log(item); //quite useful for debug
          rez += colorSpan(item.color) + ' ' + item.seriesName + ': ' + '<div class="float-end text-end m-0" style="font-weight: bold;">' + item.data + ' HBD</div><br/>';
        });

        return rez;
      }
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

  };

  constructor(private readonly hiveService: DiscussionService, public translate: TranslateService) { }

  ngAfterViewInit(): void {

    this.initLang();

    //data sloupců
    this.chartAuthor.series = this.builderSeries(this.author);
    this.chartComment.series = this.builderSeries(this.comment);
    this.chartVote.series = this.builderSeries(this.vote);
    this.chartPayout.series = this.builderSeries(this.payout);

    //popis 
    this.chartAuthor.xAxis = this.bulderXAxis();
    this.chartComment.xAxis = this.bulderXAxis();
    this.chartVote.xAxis = this.bulderXAxis();
    this.chartPayout.xAxis = this.bulderXAxis();

    //legenda
    this.chartAuthor.legend = this.builderLegend(this.author);
    this.chartComment.legend = this.builderLegend(this.comment);
    this.chartVote.legend = this.builderLegend(this.vote);
    this.chartPayout.legend = this.builderLegend(this.payout);
  }

  /**
   * Aktualizuje data grafu
   */
  updateChart(): void {
    this.mergeAuthor = {};
    this.mergeComment = {};
    this.mergeVote = {};
    this.mergePayout = {};

    this.initLang();

    //legenda
    this.mergeAuthor.legend = this.builderLegend(this.author);
    this.mergeComment.legend = this.builderLegend(this.comment);
    this.mergeVote.legend = this.builderLegend(this.vote);
    this.mergePayout.legend = this.builderLegend(this.payout);

    //data sloupců
    this.mergeAuthor.series = this.builderSeries(this.author);
    this.mergeComment.series = this.builderSeries(this.comment);
    this.mergeVote.series = this.builderSeries(this.vote);
    this.mergePayout.series = this.builderSeries(this.payout);

    //popis
    this.mergeAuthor.xAxis = this.bulderXAxis();
    this.mergeComment.xAxis = this.bulderXAxis();
    this.mergeVote.xAxis = this.bulderXAxis();
    this.mergePayout.xAxis = this.bulderXAxis();
  }

  /**
   * Sestaví sloupce osy y
   * @returns 
   */
  private builderSeries(typeData: string): any {
    let totalCounts = this.builderTotalCounts();
    let data1 = {
      name: this.nameAuthor,
      data: totalCounts.authors,
      type: 'bar'
    };
    let data2 = {
      name: this.namePost,
      data: totalCounts.posts,
      type: 'bar'
    };
    if (typeData === this.comment) {
      data1 = {
        name: this.nameComments,
        data: totalCounts.comments,
        type: 'bar'
      };
      return [data1];
    } else if (typeData === this.vote) {
      data2 = {
        name: this.nameVotes,
        data: totalCounts.votes,
        type: 'bar',

      };
      return data2;
    }
    else if (typeData === this.payout) {
      data1 = {
        name: this.namePendings,
        data: totalCounts.pendings,
        type: 'bar'
      };
      data2 = {
        name: this.namePayouts,
        data: totalCounts.payouts,
        type: 'bar'
      };
      return [data1, data2];
    }
    return [data1, data2];
  }

  /**
   * Sestaví popis osy x (vodorovná)
   * @returns 
   */
  private bulderXAxis(): any {
    return {
      type: 'category',
      //boundaryGap: false,
      data: this.builderDates()
    }
  }

  private builderLegend(typeData: string): any {
    let data = [this.nameAuthor, this.namePost];
    if (typeData === this.comment)
      data = [this.nameComments];
    else if (typeData === this.vote)
      data = [this.nameVotes];
    else if (typeData == this.payout)
      data = [this.namePendings, this.namePayouts];
    return {
      data: data
    };
  }

  /**
   * Sestaví pole datumů
   */
  private builderDates() {
    let dates = [];
    for (let date of this.hiveService.postsModel.dates) {
      dates.push(date.dateFrom + ' - ' + date.dateUntil);
    }

    dates.reverse();
    return dates;
  }

  /**
   * Sestaví pole celkových součtů
   */
  private builderTotalCounts() {
    let authors = [];
    let posts = [];
    let comments = [];
    let votes = [];
    let pendings = [];
    let payouts = [];
    for (let count of this.hiveService.postsModel.totalCount) {
      authors.push(count.totalAuthors);
      posts.push(count.totalPosts);
      comments.push(count.totalComments);
      votes.push(count.totalVotes);
      pendings.push(Number(count.totalPending.toFixed(3)));
      payouts.push(Number(count.totalPayouts.toFixed(3)));
    }
    authors.reverse();
    posts.reverse();
    comments.reverse();
    votes.reverse();
    pendings.reverse();
    payouts.reverse();
    return { authors: authors, posts: posts, comments: comments, votes: votes, pendings: pendings, payouts: payouts };
  }

  /**
   * Inicializace textů
   */
  private initLang() {
    if (this.translate.currentLang === 'en') {
      this.nameAuthor = 'Author';
      this.namePost = 'Post';
      this.nameComments = "Comments";
      this.nameVotes = "Votes";
      this.namePayouts = "Payouts";
      this.namePendings = "Pendings";
    } else {
      this.nameAuthor = 'Autor';
      this.namePost = 'Post';
      this.nameComments = "Komentáře";
      this.nameVotes = "Hlasy";
      this.namePayouts = "Vyplaceno";
      this.namePendings = "Čekající";
    }
  }

}
