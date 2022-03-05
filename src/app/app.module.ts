import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './components/bar/bar.component';
import { ModalLoadBarComponent } from './components/modalLoadBar/modalLoadBar.component';
import { ModalComponent } from './components/modal/modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PostContentComponent } from './components/post-content/post-content.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ItemTotalComponent } from './components/item-total/item-total.component';
import { NextLoadComponent } from './components/next-load/next-load.component';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    ModalLoadBarComponent,
    ModalComponent,
    FooterComponent,
    LineChartComponent,
    PostContentComponent,
    SettingsComponent,
    ItemTotalComponent,
    NextLoadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
