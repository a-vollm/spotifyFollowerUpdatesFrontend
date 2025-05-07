// src/app/callback/callback.page.ts
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {IonContent} from '@ionic/angular/standalone';

@Component({
  selector: 'app-callback',
  template: `
    <ion-content>Authentifiziere …</ion-content>`,
  imports: [IonContent]
})
export class CallbackPage implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.auth.handleCallbackWeb();
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/');
    }
  }
}
