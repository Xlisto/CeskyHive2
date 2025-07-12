/**
 * komponeta zobrazení celkového součtu
 */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TotalsCountModel } from 'src/app/models/totalsCountModel';

@Component({
  selector: 'app-item-total',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './item-total.component.html',
  styleUrls: ['./item-total.component.css']
})

/**
 * Zobrazení celkového součtu postů a autoru
 */
export class ItemTotalComponent implements OnInit {

  @Input()
  totalCount!: TotalsCountModel[];

  @Input()
  i = 0;

  @Input()
  showData = "";

  @Input()
  showPayout = true;

  @Input()
  showComment = true;

  @Input()
  showVote = true;

  constructor() { }

  ngOnInit(): void {
  }

}
