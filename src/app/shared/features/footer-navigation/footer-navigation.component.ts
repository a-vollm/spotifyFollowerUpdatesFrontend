import {Component} from '@angular/core';
import {IonIcon, IonLabel, IonTabBar, IonTabButton,} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {calendarOutline, discOutline, settingsOutline} from 'ionicons/icons';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-footer-navigation',
  templateUrl: './footer-navigation.component.html',
  styleUrls: ['./footer-navigation.component.scss'],
  imports: [
    IonTabButton,
    IonTabBar,
    IonIcon,
    IonLabel,
    RouterLink
  ]
})
export class FooterNavigationComponent {

  constructor() {
    addIcons({
      'calendar-outline': calendarOutline,
      'settings-outline': settingsOutline,
      'disc-outline': discOutline,
    });
  }

}
