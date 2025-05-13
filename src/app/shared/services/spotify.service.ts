import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
      auth: {
        uid: localStorage.getItem('uid') ?? ''
      }
    });
    this.setupSocketEvents();

    console.log(environment.apiUrl)
  }

  private getHeaders(): HttpHeaders {
    const uid = localStorage.getItem('uid') || '';
    return new HttpHeaders({'x-user-id': uid});
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
    const registration = await navigator.serviceWorker.ready;

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array('BPMdL97IPz7Ip88PI_0QpGXetjU2WgsT9NgwuAOWEBX6Avesjz3GNVXozknYFHrWVW4GeonB3_CwlLFOVMArOr8')
    });

    await this.http.post(`${this.api}/subscribe`, sub, {headers: this.getHeaders()}).toPromise();
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

  async getCacheStatus(): Promise<CacheStatus> {
    return firstValueFrom(
      this.http.get<CacheStatus>(`${this.api}/cache-status`, {
        headers: this.getHeaders()
      })
    );
  }

  async getLatest20(): Promise<any[]> {
    try {
      return await firstValueFrom(this.http.get<any[]>(`${this.api}/latest`, {
        headers: this.getHeaders()
      })) ?? [];
    } catch (error) {
      throw error;
    }
  }

  async getReleasesForYear(year: string): Promise<MonthGroup[]> {
    try {
      return await firstValueFrom(this.http.get<MonthGroup[]>(`${this.api}/releases/${year}`, {
        headers: this.getHeaders()
      })) ?? [];
    } catch (err) {
      localStorage.removeItem('uid');
      throw err
    }
  }

  getPlaylistData(playlistId: string): Observable<any> {
    try {
      return this.http.get(`${this.api}/playlist/${playlistId}`, {
        headers: this.getHeaders()
      });
    } catch (err) {
      localStorage.removeItem('uid');
      throw err
    }
  }
}
