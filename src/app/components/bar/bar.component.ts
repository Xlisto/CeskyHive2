import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { exit } from 'process';
import { AppComponent } from 'src/app/app.component';
import { ParameterFilter } from 'src/app/models/parameterFilter';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  tag = "cesky";

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
    let tag = localStorage.getItem('tag');
    let time = localStorage.getItem('time');
    let day = localStorage.getItem('day');
    let interval = localStorage.getItem('inteval');
    let dayCount = Number(localStorage.getItem('dayCount'));
    if (tag)
      this.parameterFilter.tag;
    if (time)
      this.parameterFilter.time = time;
    if (day)
      this.parameterFilter.day = day;
    if (interval)
      this.parameterFilter.interval = interval;
    if (dayCount)
      this.parameterFilter.dayCount = dayCount;

  }

  changeTextButtonGraph(button: any) {
    console.log(button)
    if (this.isVisibleGraph)
      button.textContent = "Zobrazit graf";
    else
      button.textContent = "Zobrazit seznam";
  }

}
