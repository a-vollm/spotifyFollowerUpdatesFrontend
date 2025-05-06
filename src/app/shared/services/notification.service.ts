import {Injectable} from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/compat/messaging';

@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private afMessaging: AngularFireMessaging) {
  }

  requestPermission() {
    return this.afMessaging.requestToken.toPromise();
  }

  listen() {
    return this.afMessaging.messages;
  }
}
