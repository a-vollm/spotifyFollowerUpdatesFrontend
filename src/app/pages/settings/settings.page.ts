import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonContent, IonHeader, IonSegmentButton, IonTitle, IonToolbar, Platform} from '@ionic/angular/standalone';
import {FooterNavigationComponent} from '../../shared/features/footer-navigation/footer-navigation.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterNavigationComponent, IonSegmentButton]
})
export class SettingsPage {

  constructor(
    private platform: Platform
  ) {
  }

  async requestPushPermission() {

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted.');
      this.triggerPushNotification()
      // Service Worker registrieren
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered: ', registration);
          })
          .catch((err) => {
            console.error('Service Worker registration failed: ', err);
          });
      }
    } else {
      console.log('Notification permission denied.');
    }
  }

  triggerPushNotification() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification('Hallo', {
          body: 'Dies ist eine Testbenachrichtigung.',
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/badge.png'
        });
      });
    }
  }
}
