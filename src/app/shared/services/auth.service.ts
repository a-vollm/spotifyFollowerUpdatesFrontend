import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {lastValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
  }

  getAccessToken(): string {
    return localStorage.getItem('spotify_token') || '';
  }

  getRefreshToken(): string {
    return localStorage.getItem('spotify_refresh_token') || '';
  }

  isAccessTokenExpired(): boolean {
    const expiresAt = parseInt(localStorage.getItem('spotify_expires_at') || '0', 10);
    return Date.now() >= expiresAt;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isAccessTokenExpired();
  }

  login(): void {
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    console.log(isLocalhost);
    const authUrl = isLocalhost ? '/auth/spotify' : `${environment.apiUrl}/auth/spotify`;
    window.location.href = authUrl;
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const params = new HttpParams().set('refresh_token', refreshToken);
    const result = await lastValueFrom(
      this.http.get<{ access_token: string }>(`${environment.apiUrl}/refresh`, {params})
    );

    const token = result.access_token;
    const expiresIn = 3600;
    const expiresAt = Date.now() + expiresIn * 1000;

    localStorage.setItem('spotify_token', token);
    localStorage.setItem('spotify_expires_at', expiresAt.toString());

    return token;
  }

  handleCallbackWeb(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      this.login();
      return;
    }

    const expiresIn = 3600;
    const expiresAt = Date.now() + expiresIn * 1000;

    localStorage.setItem('spotify_token', accessToken);
    localStorage.setItem('spotify_refresh_token', refreshToken);
    localStorage.setItem('spotify_expires_at', expiresAt.toString());

    if (this.isAuthenticated()) {
      this.router.navigateByUrl('releases');
    } else {
      this.login();
    }
  }
}
