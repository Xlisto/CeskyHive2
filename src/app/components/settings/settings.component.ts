
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { SettingsModel } from 'src/app/models/settingsModel';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  
  @Output()
  public settings = new SettingsModel();

  @ViewChild(NgForm, { static: false })
  public formRef!: NgForm;

  constructor() { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    let days = Number(localStorage.getItem("days"));
    let maxPosts = Number(localStorage.getItem("maxPosts"));
    let loadPosts = Number(localStorage.getItem("loadPosts"));
    let node = localStorage.getItem("node");
    let rows = Number(localStorage.getItem("rows"));
    let showPayout = localStorage.getItem("showPayout") === "true";
    let showComment = localStorage.getItem("showComment") === "true";
    let showVote = localStorage.getItem("showVote") === "true";
    let site = localStorage.getItem("site");

    if (days)
      this.settings.days = days;
    if (maxPosts)
      this.settings.maxPosts = maxPosts;
    if (loadPosts)
      this.settings.loadPosts = loadPosts;
    if (node)
      this.settings.node = node;
    if (rows)
      this.settings.rows = rows;
    if (showPayout)
      this.settings.showPayout = showPayout;
    if (showComment)
      this.settings.showComment = showComment;
    if (showVote)
      this.settings.showVote = showVote;
    if (site)
      this.settings.hiveSite = site;
  }

   /**Uloží nastavení do lokalní paměti*/
   public saveSettings() {
    if (this.settings) {
      let settings = this.settings;
      localStorage.setItem("days", String(settings.days));
      localStorage.setItem("maxPosts", String(settings.maxPosts));
      localStorage.setItem("loadPosts", String(settings.loadPosts));
      localStorage.setItem("node", settings.node);
      localStorage.setItem("rows", String(settings.rows));
      localStorage.setItem("showPayout", String(settings.showPayout));
      localStorage.setItem("showComment", String(settings.showComment));
      localStorage.setItem("showVote", String(settings.showVote));
      localStorage.setItem('site', settings.hiveSite)
    }
  }

}
