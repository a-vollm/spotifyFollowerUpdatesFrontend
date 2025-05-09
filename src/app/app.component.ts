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

  async ngOnInit() {
    if (this.authService.isLoggedIn()) {
      console.log('User logged in');
      await this.authService.refresh();
    } else {
      console.log('User not logged in');
      this.authService.login();
    }
  }
}
