import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-next-load',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
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
