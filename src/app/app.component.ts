import {Component, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {SpotifyService} from './shared/services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private spotifyService: SpotifyService,
    private platform: Platform
  ) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedPrimary = localStorage.getItem('color-primary');
    const savedSecondary = localStorage.getItem('color-secondary');

    document.body.setAttribute('color-theme', savedTheme);
    savedPrimary ? document.documentElement.style.setProperty('--ion-color-primary', savedPrimary) : undefined;
    savedSecondary ? document.documentElement.style.setProperty('--ion-color-secondary', savedSecondary) : undefined;

  }

  ngOnInit() {
    this.platform.ready().then(async () => {
      await this.spotifyService.initPush();

    });
  }
}
