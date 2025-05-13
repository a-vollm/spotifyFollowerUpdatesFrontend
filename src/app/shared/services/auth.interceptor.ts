import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const uid = localStorage.getItem('uid') ?? '';
    const cloned = req.clone({
      setHeaders: {'x-user-id': uid}
    });
    return next.handle(cloned);
  }
}
