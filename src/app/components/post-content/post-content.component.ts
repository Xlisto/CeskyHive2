/**
 * Zobrazí aktivní post (text, hlasující)
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

  @Input()
  hiveSite = "";

  showTypeData = "body";

  selectedbody = "";

  tags = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tags = JSON.parse(this.selectedPost.json_metadata).tags;

    //vyhledání jména se zavináčem a hastagu, doplněno o odkaz
    //rozparsování podle zalomení řádku
    let arr = this.selectedPost.body.split("\n");
    arr.forEach((o, i) => {
      //kontrola na výskyt znaku @
      if (o.match(/@\w+/gi)) {
        //rozparsování podle mezer
        let arr2 = o.split(" ");
        arr2.forEach((o2, i2) => {
          //kontrola na výskyt @, který musí být na začátku případně doplněné o znak *
          if (o2.match(/^[\*]*@\w+/gi)) {
            //výběr jména autora
            let authorName = o2.match(/@[a-zA-Z0-9_]+/gi);
            if (authorName) {
              arr2[i2] = arr2[i2].replace(authorName[0], '<a href="' + this.hiveSite + '/' + authorName + '" target="_blank">' + authorName + '</a>');
            }
          }
        });
        arr[i] = arr2.join(" ");
      }

      //kontrola na výskyt znaku #
      if(o.match(/#\w+/gi)) {
        //rozparsování podle mezer
        let arr2 = o.split(" ");
        arr2.forEach((o2,i2) => {
          //kontrola na výskyt #, který musí být na začátku případně doplněné o znak *
          if(o2.match(/^[\*]*#\w+/gi)) {
            //výběr tagu
            let tagName = o2.match(/[a-zA-Z0-9_]+/gi);
            if(tagName) {
              arr2[i2] = arr2[i2].replace('#'+tagName[0], '<a href="' + this.hiveSite + '/trending/' + tagName + '" target="_blank">#' + tagName + '</a>');
            }
          }
        });
        arr[i] = arr2.join(" ");
      }
    });
    this.selectedPost.body = arr.join("\n");

    this.selectedbody = this.md.render(this.selectedPost.body.replace(/pull-left/g, 'float-start').replace(/pull-right/g, 'float-end'));
    //console.log(this.selectedPost.body);
    this.selectedbody = this.selectedbody
      .replaceAll(/(<\/div>)+( )*\n/g, '</div>')//zrušení odrážky mezi dvěma divy
      .replaceAll(/(<hr>)+( )*\n/g, '<hr>')//zrušení odrážky po vodorovné čáře
      .replaceAll(/(<br>)+( )*(<br>)*\n/g, '<br>')//nahrazení dvou odrážek za jednu
      .replaceAll(/(<br>)+/g, '')
      .replaceAll(/:+\n/g, ':<br>')//zalomení za dvojtečkou
      .replaceAll(/\.+\n/g, '.<br>')//zalomení za tečkou
      .replaceAll(/\n/g, '<br>');//ostatní zalomení
  }

  clickChangeShowData(showTypeData: string) {
    this.showTypeData = showTypeData;
  }



}
