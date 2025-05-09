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
    this.platform.ready().then(async () => {
      if (!this.authService.isLoggedIn()) {
        this.authService.login();
        return;
      } else {
        this.authService.refresh(); // ← optional, bei Start erneuern falls nötig
      }
    });
  }

}
