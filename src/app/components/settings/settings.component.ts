import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingsModel } from 'src/app/models/settingsModel';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

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
  }

}
