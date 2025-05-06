import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {io, Socket} from 'socket.io-client';
import {firstValueFrom, Observable} from 'rxjs';

export interface MonthGroup {
  month: string;
  releases: any[];
}

export interface CacheStatus {
  loading: boolean;
  totalArtists: number;
  doneArtists: number;
}

@Injectable({providedIn: 'root'})
export class SpotifyService {
  private api = ''; // Leer lassen für Proxy-Nutzung
  socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('https://spotifyfollowerupdates.onrender.com', {
      transports: ['websocket'],
      withCredentials: true
    });
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.socket.on('connect', () => {
      console.log('Mit Socket.IO-Server verbunden');
    });

    this.socket.on('cacheUpdated', () => {
      console.log('Cache aktualisiert - neue Daten werden geladen');
      this.getLatest20().then(data => {
        console.log('Neue Daten empfangen:', data);
      });
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket-Verbindungsfehler:', err);
    });
  }

  onCacheUpdated(cb: () => void) {
    this.socket.on('cacheUpdated', cb);
  }

  private getAuthHeader() {
    const token = localStorage.getItem('spotify_token') || '';
    return {Authorization: `Bearer ${token}`};
  }

  async getCacheStatus(): Promise<CacheStatus> {
    try {
      return await firstValueFrom(
        this.http.get<CacheStatus>('/cache-status', { // Relativer Pfad
          headers: this.getAuthHeader()
        })
      ) || {loading: true, totalArtists: 0, doneArtists: 0};
    } catch (error) {
      console.error('Fehler beim Abrufen des Cache-Status:', error);
      throw error;
    }
  }

  async getLatest20(): Promise<any[]> {
    try {
      return await firstValueFrom(
        this.http.get<any[]>('/latest', { // Relativer Pfad
          headers: this.getAuthHeader()
        })
      ) || [];
    } catch (error) {
      console.error('Fehler beim Abrufen der neuesten Releases:', error);
      throw error;
    }
  }

  async getReleasesForYear(year: string): Promise<MonthGroup[]> {
    try {
      return await firstValueFrom(
        this.http.get<MonthGroup[]>(`/releases/${year}`, { // Relativer Pfad
          headers: this.getAuthHeader()
        })
      ) || [];
    } catch (error) {
      console.error(`Fehler beim Abrufen der Releases für ${year}:`, error);
      throw error;
    }
  }

  getPlaylistData(playlistId: string): Observable<any> {
    return this.http.get(`/playlist/${playlistId}`);
  }

  mapUsernames(ids: string[]): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`/map-usernames`, {ids});
  }

}
