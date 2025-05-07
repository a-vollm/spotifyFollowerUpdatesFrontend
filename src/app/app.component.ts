// src/app/app.component.ts
import {Component, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {AuthService} from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
      const path = window.location.pathname;
      if (path !== '/callback' && !this.authService.isAuthenticated()) {
        this.authService.login();
      }
  }
}
