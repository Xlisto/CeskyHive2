import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ParameterFilter } from 'src/app/models/parameterFilter';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  @Input()
  title = "";

  @Input()
  isVisibleGraph = true;

  parameterFilter = new ParameterFilter;

  @Output()
  onLoad: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  onShowGraph: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {

  }

  changeTextButtonGraph(button: any) {
    console.log(button)
    if (this.isVisibleGraph)
      button.textContent = "Zobrazit graf";
    else
      button.textContent = "Zobrazit seznam";
  }

}
