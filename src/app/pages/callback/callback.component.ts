import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-callback',
  template: `<p>Logging you in...</p>`
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const refreshToken = params['refresh_token'];
      const expiresIn = params['expires_in'];

      if (accessToken && refreshToken) {
        this.auth.setToken(accessToken, refreshToken, Number(expiresIn));
        // ⚠️ redirect nach Startseite OHNE Tokens in der URL
        this.router.navigate(['/'], {replaceUrl: true});
      } else if (params['error']) {
        // z.B. Spotify Login fehlgeschlagen
        console.error('Spotify Auth Error:', params['error']);
        this.auth.logout();
      } else {
        // keine Tokens vorhanden → redirect zur Loginseite
        this.auth.login();
      }
    });
  }

}
