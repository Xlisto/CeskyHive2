import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParameterFilter } from 'src/app/models/parameterFilter';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  
  @Input()
  title = "";

  parameterFilter = new ParameterFilter;

  @Output()
  onLoad: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
