import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingsModel } from 'src/app/models/settingsModel';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-next-load',
  templateUrl: './next-load.component.html',
  styleUrls: ['./next-load.component.css']
})
export class NextLoadComponent implements OnInit {

  @ViewChild(NgForm, { static: false })
  public formRef!: NgForm;

  @Input()
  public maxPosts = 10000;

  public addMaxPosts = 1000;

  constructor() { }

  ngOnInit(): void {
  }

}
