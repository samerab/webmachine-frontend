import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SalPopupModule, SalCommonModule } from '@ws-sal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, reducers } from './store/index';
import { AuxOutletComponent } from './aux-outlet/aux-outlet.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FixedGridEffects } from '@ws-store/fixed-grid/fixed-grid.effects';
import { HomeComponent } from './shell/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './shell/header/header.component';
import { FooterComponent } from './shell/footer/footer.component';
import { ShellComponent } from './shell/shell.component';
import { UserEffects } from '@ws-store/user/user.effects';
import { SharedModule } from './shared/shared-module/shared.module';
import { WebsiteEffects } from '@ws-store/website/website.effects';

@NgModule({
  declarations: [
    AppComponent,
    AuxOutletComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ShellComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([FixedGridEffects, UserEffects, WebsiteEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    CoreModule,
    SalPopupModule,
    MatProgressSpinnerModule,
    SalCommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    SharedModule,
  ],
  providers: [{ provide: Window, useValue: window }],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
