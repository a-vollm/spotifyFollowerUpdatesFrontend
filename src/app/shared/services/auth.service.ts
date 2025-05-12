import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly k = 'sp';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {
  }

  isLoggedIn() {
    return this.loggedIn$.value;
  }

  login() {
    window.location.href = '/auth/spotify';
  }

  logout() {
    sessionStorage.removeItem(this.k);
    this.loggedIn$.next(false);
  }

  setToken(a: string, r: string, e: number) {
    const t = Date.now() + e * 1000;
    sessionStorage.setItem(this.k, JSON.stringify({a, r, t}));
    this.loggedIn$.next(true);
  }

  getAccessToken(): string | null {
    const v = sessionStorage.getItem(this.k);
    if (!v) return null;
    const {a, t} = JSON.parse(v);
    return Date.now() < t ? a : null;
  }

  private hasValidToken(): boolean {
    const v = sessionStorage.getItem(this.k);
    if (!v) return false;
    const {t} = JSON.parse(v);
    return Date.now() < t;
  }
}
