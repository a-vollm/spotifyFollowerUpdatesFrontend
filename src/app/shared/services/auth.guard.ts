import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import {environment} from '../../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {
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
