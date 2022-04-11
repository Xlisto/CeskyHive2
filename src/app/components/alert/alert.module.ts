import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent } from './alert.component';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [AlertComponent],
  exports: [AlertComponent],
  bootstrap: [AlertComponent]
})
export class NgbdAlertCloseableModule {}