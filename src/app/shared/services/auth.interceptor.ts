import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {
  }

  /**
   * Intercepts HTTP requests and adds authentication headers.
   * @param req The outgoing HTTP request.
   * @param next The next handler in the chain.
   * @returns An observable of the HTTP event.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      withCredentials: true,
      headers: req.headers.set('Content-Type', 'application/json')
    });

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.authService.login();
        }
        return throwError(() => err);
      })
    );
  }
}
