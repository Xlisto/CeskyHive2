import { Component, OnInit } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { DiscussionService } from 'src/app/services/discussions.service';

@Component({
  selector: 'app-modalloadbar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './modalLoadBar.component.html',
  styleUrls: ['./modalLoadBar.component.css']
})
export class ModalLoadBarComponent implements OnInit {

  public hiveService: DiscussionService;

  loadPosts = 0;

  constructor(hiveService: DiscussionService) {
    this.hiveService = hiveService;
  }

  ngOnInit(): void {
    this.hiveService.loadPosts$.subscribe(count => this.loadPosts = count);
  }

}
