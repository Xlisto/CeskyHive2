import { Component, Input, OnInit } from '@angular/core';
import { SettingsModel } from 'src/app/models/settingsModel';
import { TotalsCountModel } from 'src/app/models/totalsCountModel';

@Component({
  selector: 'app-item-total',
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
  settings!:SettingsModel;

  @Input()
  showData = "";

  constructor() { }

  ngOnInit(): void {
  }

}
