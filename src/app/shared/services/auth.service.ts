import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  constructor(private http: HttpClient, private router: Router) {
  }

  login(): void {
    window.location.href = `${environment.apiUrl}/auth/spotify`;
  }

  // Wird im Callback-Component aufgerufen
  exchangeCode(code: string) {
    return this.http.post<{
      access_token: string,
      refresh_token: string,
      expires_in: number
    }>(`${environment.apiUrl}/auth/token`, {code})
      .subscribe(res => {
        this.accessToken = res.access_token;
        this.refreshToken = res.refresh_token;
        this.expiresAt = Date.now() + res.expires_in * 1000;
        this.router.navigate(['/']);
      });
  }

  // Token erneuern, wenn abgelaufen
  refresh(): void {
    if (!this.refreshToken) return;
    this.http.post<{ access_token: string, expires_in: number }>(
      `${environment.apiUrl}/auth/refresh`, {refresh_token: this.refreshToken}
    ).subscribe(res => {
      this.accessToken = res.access_token;
      this.expiresAt = Date.now() + res.expires_in * 1000;
    });
  }

  setToken(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = Date.now() + 3600 * 1000; // ggf. über param
  }

  getToken(): string | null {
    if (!this.accessToken) return null;
    if (Date.now() >= this.expiresAt) {
      this.refresh();
      return null;
    }
    return this.accessToken;
  }

  logout(): void {
    this.accessToken = this.refreshToken = null;
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
