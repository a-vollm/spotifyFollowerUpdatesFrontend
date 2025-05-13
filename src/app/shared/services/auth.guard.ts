import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor() {
  }

  canActivate(): boolean {
    const access = sessionStorage.getItem('access_token');
    const expires = Number(sessionStorage.getItem('expires_at') || 0);

    if (access && Date.now() < expires - 30_000) {
      return true;
    }

    window.location.href = `${environment.apiUrl}/auth/spotify`;
    return false;
  }

}
