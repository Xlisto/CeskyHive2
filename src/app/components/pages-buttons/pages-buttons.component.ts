import { Component, Input, OnInit } from '@angular/core';
import { PagesModel } from 'src/app/models/pagesModel';

@Component({
  selector: 'app-pages-buttons',
  templateUrl: './pages-buttons.component.html',
  styleUrls: ['./pages-buttons.component.css']
})
export class PagesButtonsComponent implements OnInit {

  @Input()
  actualView!: PagesModel;

  constructor() { }

  ngOnInit(): void {
  }

  pageUp() {
    if ((this.actualView.actualView + this.actualView.rowsPages) < this.actualView.totalItems) {
      this.actualView.actualPages++;
      this.actualView.actualView += this.actualView.rowsPages;
    }
  }

  pageDown() {
    if (this.actualView.actualPages > 1) {
      this.actualView.actualPages--;
      this.actualView.actualView -= this.actualView.rowsPages;
    }
  }

}
