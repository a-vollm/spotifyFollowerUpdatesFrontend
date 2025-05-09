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

  setToken(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = Date.now() + expiresIn * 1000;
  }

  async refresh(): Promise<void> {  // 👈 async machen
    if (!this.refreshToken) return;

    try {
      const res = await this.http.post<{
        access_token: string,
        expires_in: number
      }>(`${environment.apiUrl}/auth/refresh`, {
        refresh_token: this.refreshToken
      }).toPromise();

      this.accessToken = res.access_token;
      this.expiresAt = Date.now() + res.expires_in * 1000;
    } catch (error) {
      this.logout();
    }
  }

  getToken(): string | null {
    if (!this.accessToken) return null;

    // Puffer von 60 Sekunden für Token-Refresh
    if (Date.now() >= this.expiresAt - 60000) {
      this.refresh(); // 👈 Async-Aufruf ohne await
      return this.accessToken; // 👈 Gib aktuellen Token temporär zurück
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
