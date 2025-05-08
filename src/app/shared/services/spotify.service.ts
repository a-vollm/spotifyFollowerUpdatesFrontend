import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {io, Socket} from 'socket.io-client';
import {firstValueFrom, Observable} from 'rxjs';
import {environment} from '../../../environments/environment.prod';

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
  private isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  private api = this.isLocalhost ? '' : environment.apiUrl;
  socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(this.api, {
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

    this.socket.on('socketTest', () => {
      console.log('socket test');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket-Verbindungsfehler:', err);
    });
  }

  async initPush() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array('BPMdL97IPz7Ip88PI_0QpGXetjU2WgsT9NgwuAOWEBX6Avesjz3GNVXozknYFHrWVW4GeonB3_CwlLFOVMArOr8')
    });

    await this.http.post('/subscribe', sub).toPromise();
    console.log('🔔 PushSubscription registriert:', sub);
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
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
        this.http.get<CacheStatus>(`${this.api}/cache-status`, {
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
        this.http.get<any[]>(`${this.api}/latest`, {
          headers: this.getAuthHeader()
        })
      ) || [];
    } catch (error) {
      localStorage.removeItem('spotify_token');
      console.error('Fehler beim Abrufen der neuesten Releases:', error);
      throw error;
    }
  }

  async getReleasesForYear(year: string): Promise<MonthGroup[]> {
    try {
      return await firstValueFrom(
        this.http.get<MonthGroup[]>(`${this.api}/releases/${year}`, {
          headers: this.getAuthHeader()
        })
      ) || [];
    } catch (error) {
      localStorage.removeItem('spotify_token');
      console.error(`Fehler beim Abrufen der Releases für ${year}:`, error);
      throw error;
    }
  }

  getPlaylistData(playlistId: string): Observable<any> {
    try {
      return this.http.get(`${this.api}/playlist/${playlistId}`);
    } catch (error) {
      console.error(`Fehler beim Abrufen der Playlist für ${playlistId}:`, error);
      throw error;
    }

  }
}
