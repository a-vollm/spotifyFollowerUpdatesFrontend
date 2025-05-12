import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth.service';
import {catchError, from, Observable, switchMap, throwError} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    const uid = this.auth.getUid();

    const authReq = token
      ? req.clone({setHeaders: {Authorization: `Bearer ${token}`, 'X-User-Id': uid || ''}})
      : req;

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401 && this.auth.getRefreshToken()) {
          return from(
            fetch('/auth/refresh', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({uid})
            }).then(res => res.json())
          ).pipe(
            switchMap(data => {
              this.auth.setToken(data.access, data.expires_in);
              return next.handle(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${data.access}`,
                  'X-User-Id': uid || ''
                }
              }));
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
