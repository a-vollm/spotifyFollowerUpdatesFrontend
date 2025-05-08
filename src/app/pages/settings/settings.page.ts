import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonButton, IonContent, IonHeader, IonTitle, IonToolbar, Platform} from '@ionic/angular/standalone';
import {FooterNavigationComponent} from '../../shared/features/footer-navigation/footer-navigation.component';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterNavigationComponent, IonButton]
})
export class SettingsPage {

  constructor(
    private platform: Platform,
    private swUpdate: SwUpdate
  ) {
  }

  protected async initPush() {
    const permission = await Notification.requestPermission();
    console.log(permission)
    if (permission !== 'granted') {
      console.warn('Benachrichtigungen abgelehnt');
      return;
    }

    console.log('Benachrichtigungen erlaubt');

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('ngsw-worker.js');
        console.log('Service Worker registriert:', registration);

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

  checkForUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then(hasUpdate => {
        if (hasUpdate) {
          this.swUpdate.activateUpdate().then(() => {
            document.location.reload();
          });
        } else {
          console.log('Kein Update verfügbar');
        }
      });
    }
  }
}
