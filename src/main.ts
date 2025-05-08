// main.ts
import {bootstrapApplication} from '@angular/platform-browser';
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {AuthInterceptor} from './app/shared/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular({mode: 'md'}),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
});

function setAppHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
setAppHeight();
