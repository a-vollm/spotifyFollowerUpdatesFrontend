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
    this.route.queryParams.subscribe(p => {
      const access = p['access'];
      const refresh = p['refresh'];
      const exp = +p['exp'];   // Sekunden

      if (access && refresh && exp) {
        this.auth.setToken(access, refresh, exp);
        this.router.navigate(['/'], {replaceUrl: true});
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
