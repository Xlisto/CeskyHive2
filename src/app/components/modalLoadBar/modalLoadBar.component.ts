import { Component, OnInit } from '@angular/core';
import { Discussion } from '@hiveio/dhive';
import { DiscussionService } from 'src/app/services/discussions.service';

@Component({
  selector: 'app-modalloadbar',
  templateUrl: './modalLoadBar.component.html',
  styleUrls: ['./modalLoadBar.component.css']
})
export class ModalLoadBarComponent implements OnInit {

  public hiveService: DiscussionService;

  interval;

  loadPosts = 0;

  constructor(hiveService: DiscussionService) {
    this.hiveService = hiveService;
    this.interval = setInterval(() => this.showLoadData(), 500);
  }

  ngOnInit(): void {
  }

  /**
   * Počet načtených postů v paměti
   */
  showLoadData() {
    this.loadPosts = this.hiveService.loadPosts;
    //console.log(this.loadPosts);
  }

  /**
   * Zastaví aktualizaci udajů o načtených postech
   */
  stopInterval() {
    clearInterval(this.interval);
  }

}
