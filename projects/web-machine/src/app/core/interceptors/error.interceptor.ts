import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { RoutingService } from '../services/routing.service';
import { EnvService } from '../services/env/env.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private routingSv: RoutingService, private envSv: EnvService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log('request', request);
        if (err?.error?.message === 'error.not_authenticated') {
          if (this.isClient(request)) {
            this.routingSv.navigate('loginClient');
          } else {
            this.routingSv.navigate('loginUser');
          }
        }
        return throwError(() => err);
      })
    );
  }

  isClient(request) {
    const url = request.url;
    const host = this.envSv.host;
    if (url.includes(host) && !url.includes(`.${host}`)) {
      return false;
    }
    return true;
  }
}
