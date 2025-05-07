// src/app/app.component.ts
import {Component, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {AuthService} from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
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
    });

    this.platform.ready().then(() => {
      this.requestPushPermission()

    });
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
