import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
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
