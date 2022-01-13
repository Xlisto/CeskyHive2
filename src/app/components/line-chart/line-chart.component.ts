import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { HiveService } from 'src/app/services/discussions.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit {

  private author = "author";
  private comment = "comment";
  private vote = "vote";
  private payout = "payout";

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
    }
  };

  chartComment: EChartsOption = {
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
    }
  };

  chartVote: EChartsOption = {
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
    color: ["#91cc75"],

  };

  chartPayout: EChartsOption = {
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
      }
    },

  };

  constructor(private readonly hiveService: HiveService) { }

  ngAfterViewInit(): void {
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
    /*this.chartOption.title =  {
      text: 'Autoři, napsané posty',
      //subtext: 'Living Expenses in Shenzhen'
    };*/

    console.log(this.chartPayout.series);
  }

  /**
   * Aktualizuje data grafu
   */
  updateChart(): void {
    this.mergeAuthor = {};
    this.mergeComment = {};
    this.mergeVote = {};
    this.mergePayout = {};
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
      name: "Autor",
      data: totalCounts.authors,
      type: 'bar'
    };
    let data2 = {
      name: "Post",
      data: totalCounts.posts,
      type: 'bar'
    };
    if (typeData === this.comment) {
      data1 = {
        name: "Komentáře",
        data: totalCounts.comments,
        type: 'bar'
      };
      return [data1];
    } else if (typeData === this.vote) {
      data2 = {
        name: "Hlasy",
        data: totalCounts.votes,
        type: 'bar',

      };
      return data2;
    }
    else if (typeData === this.payout) {
      data1 = {
        name: "Čekající",
        data: totalCounts.pendings,
        type: 'bar'
      };
      data2 = {
        name: "Vyplaceno",
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
    let data = ['Autor', 'Post'];
    if (typeData === this.comment)
      data = ['Komentáře'];
    else if (typeData === this.vote)
      data = ['Hlasy'];
    else if (typeData == this.payout)
      data = ['Čekající', 'Vyplaceno'];
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

}
