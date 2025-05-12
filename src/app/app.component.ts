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
  }

  ngOnInit() {
    this.platform.ready().then(async () => {
      this.spotifyService.initPush();

    });
  }

}
