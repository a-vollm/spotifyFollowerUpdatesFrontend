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

  // Wird im Callback-Component aufgerufen
  exchangeCode(code: string) {
    return this.http.post<{
      access_token: string,
      refresh_token: string,
      expires_in: number
    }>(`${environment.apiUrl}/auth/token`, {code})
      .subscribe({
        next: (res) => {
          console.log('Token exchange successful:', res);
          this.setToken(res.access_token, res.refresh_token, res.expires_in);
          // 🔄 Navigiere erst NACH dem Speichern
          setTimeout(() => {
            this.router.navigate(['/'], {replaceUrl: true});
          }, 300);
        },
        error: (err) => {
          console.error('Token exchange failed:', err);
          this.logout();
        }
      });
  }

// In der setToken-Methode:
  setToken(accessToken: string, refreshToken: string, expiresIn: number): void {
    // Füge Validierung hinzu
    if (!accessToken || !refreshToken || !expiresIn) {
      this.logout();
      return;
    }

    // Rest wie vorhanden
  }

// In der loadFromStorage-Methode:
  private loadFromStorage(): void {
    try {
      const access = sessionStorage.getItem('access_token');
      const refresh = sessionStorage.getItem('refresh_token');
      const expires = sessionStorage.getItem('expires_at');

      if (!access || !refresh || !expires) {
        this.logout();
        return;
      }

      this.expiresAt = parseInt(expires);
      if (isNaN(this.expiresAt)) this.logout();

      // Setze die Werte erst nach erfolgreicher Validierung
      this.accessToken = access;
      this.refreshToken = refresh;
    } catch {
      this.logout();
    }
  }


  async refresh(): Promise<void> {
    if (!this.refreshToken || this.refreshInProgress) return;

    this.refreshInProgress = true;
    try {
      const res = await this.http.post<{
        access_token: string,
        expires_in: number
      }>(`${environment.apiUrl}/auth/refresh`, {
        refresh_token: this.refreshToken
      }).toPromise();

      // 🔄 Speichere den neuen Access-Token im Session Storage
      this.setToken(res.access_token, this.refreshToken, res.expires_in); // refreshToken bleibt gleich
    } catch {
      this.logout();
    } finally {
      this.refreshInProgress = false;
    }
  }

  getToken(): string | null {
    this.loadFromStorage();
    if (!this.accessToken) return null;

    if (Date.now() >= this.expiresAt - 60000) {
      this.refresh();
      return this.accessToken;
    }

    return this.accessToken;
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
