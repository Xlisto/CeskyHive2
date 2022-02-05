import { Component, OnInit } from '@angular/core';
import { SettingsModel } from 'src/app/models/settingsModel';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public settings = new SettingsModel();

  constructor() { }

  ngOnInit(): void {
    let days = Number(localStorage.getItem("days"));
    let maxPosts = Number(localStorage.getItem("maxPosts"));
    let loadPosts = Number(localStorage.getItem("loadPosts"));
    let node = localStorage.getItem("node");
    let rows = Number(localStorage.getItem("rows"));
    if (days)
      this.settings.days = days;
    if (maxPosts)
      this.settings.maxPosts = maxPosts;
    if (loadPosts)
      this.settings.loadPosts = loadPosts;
    if (node)
      this.settings.node = node;
    if (node)
      this.settings.rows = rows;
  }

}
