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
      const code = params['code']; // 🔑 Spotify gibt einen CODE zurück, keine Tokens!
      const error = params['error'];
      console.log(params);
      console.log(code);
      console.log(error);
      if (code) {
        // Code an AuthService übergeben → Tokens werden abgerufen
        this.auth.exchangeCode(code);
      } else if (error) {
        console.error('Auth error:', error);
        this.auth.logout();
      } else {
        //this.router.navigate(['/']);
      }
    });
  }
}
