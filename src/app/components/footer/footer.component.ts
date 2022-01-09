import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
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
