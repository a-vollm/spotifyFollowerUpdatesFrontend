import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, from, Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getAccessToken();
    const isExpired = this.auth.isAccessTokenExpired();

    const handleRequest = (tokenToUse: string) => {
      const authReq = req.clone({
        setHeaders: {Authorization: `Bearer ${tokenToUse}`}
      });
      return next.handle(authReq);
    };

    const tryRefreshAndRetry = () => {
      return from(this.auth.refreshToken()).pipe(
        switchMap(newToken => handleRequest(newToken)),
        catchError(() => {
          this.auth.login();
          return EMPTY;
        })
      );
    };

    if (!token || isExpired) {
      return tryRefreshAndRetry();
    }

    return handleRequest(token).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return tryRefreshAndRetry();
        }

        return throwError(() => err);
      })
    );
  }
}
