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

// app.component.ts (korrigiert)
  async ngOnInit() {
    if (this.authService.isLoggedIn()) {
      console.log('User is logged in');
      await this.authService.refresh(); // Token verlängern
    } else {
      console.log('User is NOT logged in');
      this.authService.login(); // Login starten
    }
  }
}
