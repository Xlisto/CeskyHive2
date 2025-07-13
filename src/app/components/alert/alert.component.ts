import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [TranslateModule, NgbAlertModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input()
  closed = true;

  @Output()
  closedChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {}

  showAlert() {
    setTimeout(() => {this.closeAlert();this.closed = true;}, 5000);
  }

  closeAlert() {
    this.closedChange.emit(true);
  }
}
