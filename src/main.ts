// main.ts
import {bootstrapApplication} from '@angular/platform-browser';
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withHashLocation, withPreloading} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {TokenInterceptor} from './app/shared/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withHashLocation()
    ),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},

    // 👉  Interceptor per withInterceptors() registrieren
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},

    provideIonicAngular({mode: 'md'}),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
});

function setAppHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
setAppHeight();
