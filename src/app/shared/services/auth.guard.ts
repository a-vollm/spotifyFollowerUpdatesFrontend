import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    const uid = localStorage.getItem('uid');
    if (uid) return true;

    window.location.href = `${environment.apiUrl}/auth/spotify`;
    return false;
  }
}
