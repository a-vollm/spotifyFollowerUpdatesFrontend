import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private refreshInProgress = false;

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  login(): void {
    window.location.href = `${environment.apiUrl}/auth/spotify`;
  }

  setToken(access: string, refresh: string, expSec: number, uid: string) {
    sessionStorage.setItem('access_token', access);
    sessionStorage.setItem('refresh_token', refresh);

    sessionStorage.setItem('expires_at', (Date.now() + expSec * 1000).toString());
    sessionStorage.setItem('uid', uid);
  }

  updateAccessToken(access: string, expSec: number) {
    sessionStorage.setItem('access_token', access);
    sessionStorage.setItem('expires_at', (Date.now() + expSec * 1000).toString());
  }

  /* Getter */
  getToken() {
    return sessionStorage.getItem('access_token');
  }

  getRefreshToken() {
    return sessionStorage.getItem('refresh_token');
  }

  getUid() {
    return sessionStorage.getItem('uid');
  }

  private loadFromStorage(): void {
    const access = sessionStorage.getItem('access_token');
    const refresh = sessionStorage.getItem('refresh_token');
    const expires = sessionStorage.getItem('expires_at');

    if (access && refresh && expires) {
      this.accessToken = access;
      this.refreshToken = refresh;
      this.expiresAt = parseInt(expires);
    }
  }

  isLoggedIn(): boolean {
    this.loadFromStorage();
    return !!this.accessToken && Date.now() < this.expiresAt;
  }

  logout(): void {
    this.accessToken = this.refreshToken = null;
    this.router.navigate(['/']);
  }
}
