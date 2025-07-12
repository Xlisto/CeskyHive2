import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  visibleDiscort = false;

  constructor() { }

  ngOnInit(): void {
  }

  showDiscort() {
    if (this.visibleDiscort)
      this.visibleDiscort = false;
    else
      this.visibleDiscort = true;
  }

}
