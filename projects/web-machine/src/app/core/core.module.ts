import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvProvider } from './services/env/env.service.provider';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DbInterceptor } from './interceptors/db.interceptor';
import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { UserService } from './services/user.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [
    EnvProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DbInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CookieInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    UserService,
  ],
})
export class CoreModule {}
