import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(): void {
    window.location.href = `${environment.apiUrl}/auth/spotify`;
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/logout`, {}, {withCredentials: true})
      .subscribe(() => window.location.href = '/');
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/check-auth`, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      map(response => response.status === 200),
      catchError(() => of(false))
    );
  }
}
