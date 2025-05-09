import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class SpotifyService {
  constructor(private http: HttpClient) {
  }

  getCacheStatus() {
    return this.http.get(`${environment.apiUrl}/cache-status`);
  }

  getReleases(year: string) {
    return this.http.get(`${environment.apiUrl}/releases/${year}`);
  }

  getLatest20() {
    return this.http.get(`${environment.apiUrl}/latest`);
  }

  getPlaylist(id: string) {
    return this.http.get(`${environment.apiUrl}/playlist/${id}`);
  }

  subscribePush(sub: any) {
    return this.http.post(`${environment.apiUrl}/subscribe`, sub);
  }
}
