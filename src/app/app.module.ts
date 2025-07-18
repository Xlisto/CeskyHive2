import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BarComponent } from './components/bar/bar.component';
import { ModalLoadBarComponent } from './components/modalLoadBar/modalLoadBar.component';
import { ModalComponent } from './components/modal/modal.component';
import { FooterComponent } from './components/footer/footer.component';
//import { NgxEchartsModule } from 'ngx-echarts';
import { TotalChartComponent } from './components/charts/total-chart/total-chart.component';
import { PostContentComponent } from './components/post-content/post-content.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ItemTotalComponent } from './components/item-total/item-total.component';
import { NextLoadComponent } from './components/next-load/next-load.component';
import { PagesButtonsComponent } from './components/pages-buttons/pages-buttons.component';
import { AuthorsChartComponent } from './components/charts/authors-chart/authors-chart.component';
import { VotesChartComponent } from './components/charts/votes-chart/votes-chart.component';
import { ClipboardButtonComponent } from './components/cliboard-button/clipboard-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './components/alert/alert.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    declarations: [],
    bootstrap: [], 
    imports: [
        BarComponent,
        ModalLoadBarComponent,
        ModalComponent,
        FooterComponent,
        TotalChartComponent,
        PostContentComponent,
        SettingsComponent,
        ItemTotalComponent,
        NextLoadComponent,
        PagesButtonsComponent,
        AuthorsChartComponent,
        VotesChartComponent,
        ClipboardButtonComponent,
        AlertComponent,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        //NgxEchartsModule.forRoot({
        //    echarts: () => import('echarts').then((m: any) => m.default || m)
        //}),
        NgbModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
