import {Component, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {AuthService} from './shared/services/auth.service';
import {SpotifyService} from './shared/services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      const path = window.location.pathname;
      if (path !== '/callback' && !this.authService.isAuthenticated()) {
        this.authService.login();
      }

      this.spotifyService.initPush();
    });
  }

}
