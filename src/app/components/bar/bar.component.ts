import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  @Output()
  onShowSettings: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public onChangeLang: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'cs']);
    translate.setDefaultLang('en');
    this.translate.currentLang = 'en';
  }

  ngOnInit(): void {
    let tag = localStorage.getItem('tag');
    let time = localStorage.getItem('time');
    let day = localStorage.getItem('day');
    let interval = localStorage.getItem('interval');
    let dayCount = Number(localStorage.getItem('dayCount'));
    let lang = localStorage.getItem('lang');

    if (tag)
      this.parameterFilter.tag = tag;
    if (time)
      this.parameterFilter.time = time;
    if (day)
      this.parameterFilter.day = day;
    if (interval)
      this.parameterFilter.interval = interval;
    if (dayCount)
      this.parameterFilter.dayCount = dayCount;
    if (lang) {
      this.translate.use(lang);
      this.translate.currentLang = lang;
    }

  }

  changeTextButtonGraph(button: any) {
    //console.log(button)
    let graph = "Graf";
    let list = "Seznam";
    if(this.translate.currentLang === 'en') {
      graph = "Graph";
      list = "List";
    }
    if (this.isVisibleGraph)
      button.textContent = graph;
    else
      button.textContent = list;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
    localStorage.setItem('lang', lang);
   
  }

}
