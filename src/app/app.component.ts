import {Component, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {AuthService} from './shared/services/auth.service';
import {SpotifyService} from './shared/services/spotify.service';
import {Router} from '@angular/router';

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
    private readonly router: Router,
    private platform: Platform
  ) {
  }

  async ngOnInit() {
    await this.platform.ready().then(() => {
      setTimeout(() => {
        if (this.router.url.startsWith('/callback')) return;

        // 2)  Gewohnte Logik
        if (this.authService.isLoggedIn()) {
          this.authService.refresh();
        } else {
          this.authService.login();
        }
      }, 300)
    });
  }

}
