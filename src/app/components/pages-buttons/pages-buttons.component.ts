import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesModel } from 'src/app/models/pagesModel';

@Component({
  selector: 'app-pages-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pages-buttons.component.html',
  styleUrls: ['./pages-buttons.component.css']
})
export class PagesButtonsComponent implements OnInit {

  @Input()
  actualView!: PagesModel;

  @Input()
  rows = 100;

  constructor() { }

  ngOnInit(): void {
  }

  pageUp() {
    if ((this.actualView.actualView + this.rows) < this.actualView.totalItems) {
      this.actualView.actualPages++;
      this.actualView.actualView += this.rows;
    }
  }

  pageDown() {
    if (this.actualView.actualPages > 1) {
      this.actualView.actualPages--;
      this.actualView.actualView -= this.rows;
    }
  }

  getTotalPages() {
    return Math.ceil(this.actualView.totalItems/this.rows);
   //console.log(this.actualView.totalItems);
    
}

}
