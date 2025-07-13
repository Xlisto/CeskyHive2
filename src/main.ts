import { enableProdMode, importProvidersFrom } from '@angular/core';

import { httpTranslateLoader } from './app/app.module';
import { environment } from './environments/environment';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app/app.component';
import { NgxEchartsModule } from 'ngx-echarts';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      NgbModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [ HttpClient ]
        }
      })
    ),
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts').then((m: any) => m.default || m)
      })
    )
  ]
}).catch(err => console.error(err));


