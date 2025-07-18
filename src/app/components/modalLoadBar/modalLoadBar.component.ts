import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { DiscussionService } from 'src/app/services/discussions.service';

@Component({
  selector: 'app-modalloadbar',
  standalone: true,
  imports: [TranslateModule, DecimalPipe],
  templateUrl: './modalLoadBar.component.html',
  styleUrls: ['./modalLoadBar.component.css']
})
export class ModalLoadBarComponent implements OnInit {

  public hiveService: DiscussionService;

  loadPosts = 0;
  loadHistory = 0;

  constructor(hiveService: DiscussionService) {
    this.hiveService = hiveService;
  }

  ngOnInit(): void {
    this.hiveService.loadPosts$.subscribe(count => this.loadPosts = count);
    this.hiveService.loadHistory$.subscribe(days => this.loadHistory = days);
  }

}
