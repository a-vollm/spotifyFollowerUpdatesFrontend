import {Component, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {AuthService} from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      const path = window.location.pathname;
      if (path !== '/callback' && !this.authService.isAuthenticated()) {
        this.authService.login();
      }

      this.initPush();
    });
  }

  private async initPush() {
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
