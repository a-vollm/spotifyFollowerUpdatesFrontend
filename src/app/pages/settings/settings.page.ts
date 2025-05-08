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

  protected async initPush() {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.warn('Benachrichtigungen abgelehnt');
      return;
    }

    console.log('Benachrichtigungen erlaubt');

    // Service Worker registrieren
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registriert:', registration);

        // Notification direkt auslösen
        registration.showNotification('Hallo 👋', {
          body: 'Dies ist eine Testbenachrichtigung.',
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/badge.png'
        });

      } catch (error) {
        console.error('Fehler beim Registrieren des Service Workers:', error);
      }
    } else {
      console.warn('Service Worker wird nicht unterstützt');
    }
  }
}
