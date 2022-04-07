import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Discussion } from '@hiveio/dhive';
import { AuthorSortModel } from 'src/app/models/authorSortModel';
import { DateFormat } from 'src/app/models/dateFormat';
import { PostsModel } from 'src/app/models/postsModel';
import { SettingsModel } from 'src/app/models/settingsModel';
import { TotalsCountModel } from 'src/app/models/totalsCountModel';
import { DiscussionService } from 'src/app/services/discussions.service';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-clipboard-button',
  templateUrl: './clipboard-button.component.html',
  styleUrls: ['./clipboard-button.component.css']
})
export class ClipboardButtonComponent implements AfterViewInit {

  @Input()
  i = 0;

  @Input()
  showData = "";

  postsModel!: PostsModel;

  @Input()
  public settings = new SettingsModel();

  constructor(
    private readonly discussionService: DiscussionService,
    public readonly dateFormat: DateFormat) {
    this.postsModel = this.discussionService.postsModel
  }
  ngAfterViewInit(): void {
  }



  /**
   * Vloží naformátovaný obsah do schránky
   * @param i 
   */
  copyText(i: number) {
    let showComment = this.settings.showComment;
    let showPayout = this.settings.showPayout;
    let showVote = this.settings.showVote;

    let textCopy = "";
    let total: TotalsCountModel = this.postsModel.totalCount[i];;

    if (this.showData === "post") {
      
      //hlavička + zápatí
      let tableHeader = "|Datum|Autor|Titulek|";
      let tableSeparator = "|-|-|-|";
      let tableFooter = "|**Celkem**|**Autorů: " + total.totalAuthors + "**|**Postů: " + total.totalPosts + "**|";

      if (showPayout) {
        tableHeader += "Čekající|Vyplaceno|";
        tableSeparator += "-|-|";
        tableFooter += "**" + total.totalPending.toFixed(3) + " HBD**|**" + total.totalPayouts.toFixed(3) + " HBD**|"
      }
      if (showComment) {
        tableHeader += "Komentáře|";
        tableSeparator += "-|";
        tableFooter += "**" + total.totalComments + "**|";
      }
      if (showVote) {
        tableHeader += "Hlasy|Záporné hlasy|";
        tableSeparator += "-|-|";
        tableFooter += "**" + total.totalVotes + "**|**" + total.totalNegativeVotes + "**|";
      }
      tableHeader += "\n";
      tableSeparator += "\n";
      textCopy += tableHeader + tableSeparator;

      //sestavení seznamu postů - obsah tabulky
      this.postsModel.postsSorted[i].forEach((post: Discussion) => {
        textCopy += "|" + this.dateFormat.getLocaleDate(new Date(post.created)) + "|@" + post.author + "|" + post.title + "|";
        if (showPayout)
          textCopy += post.pending_payout_value + "|" + post.total_payout_value + "|";
        if (showComment)
          textCopy += post.children + "|";
        if (showVote)
          textCopy += post.active_votes.length + "|" + this.postsModel.negativeVotes(post);
        textCopy += "\n";

      });

      //připojení zápatí
      textCopy += tableFooter;
    }

    if (this.showData === "author") {

      //hlavička + zápatí
      let tableHeader = "|Autor|Posty|";
      let tableSeparator = "|-|-|";
      let tableFooter = "|**Autorů: " + total.totalAuthors + "**|**Postů: " + total.totalPosts + "**|";

      if (showPayout) {
        tableHeader += "Čekající|Vyplaceno|";
        tableSeparator += "-|-|";
        tableFooter += "**" + total.totalPending.toFixed(3) + " HBD**|**" + total.totalPayouts.toFixed(3) + " HBD**|";
      }
      if (showComment) {
        tableHeader += "Komentáře|";
        tableSeparator += "-|";
        tableFooter += "**" + total.totalComments + "**|";
      }
      if (showVote) {
        tableHeader += "Hlasy|Záporné hlasy|";
        tableSeparator += "-|-|";
        tableFooter += "**" + total.totalVotes + "**|**" + total.totalNegativeVotes + "**|";
      }
      tableHeader += "\n";
      tableSeparator += "\n";
      textCopy += tableHeader + tableSeparator;

      //sestavení seznamu autorů - obsah tabulky
      this.postsModel.postsAuthor[i].forEach((author: AuthorSortModel) => {
        textCopy += "|@" + author.author + "|" + author.posts + "|";
        if (showPayout)
          textCopy += author.pendingPayoutValue.toFixed(3) + "|" + author.totalPayoutValue.toFixed(3) + "|";
        if (showComment)
          textCopy += author.comments + "|";
        if (showVote)
          textCopy += author.votes + "|" + author.negativeVotes + "|";
        textCopy += "\n";
      });

      //připojení zápatí
      textCopy += tableFooter;
    }


    navigator.clipboard.writeText(textCopy);
  }

}
