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
      // Prüfe auf Fehler zuerst
      if (params['error']) {
        this.router.navigate(['/'], {queryParams: {error: params['error']}});
        return;
      }

      const access = params['access'];
      const refresh = params['refresh'];
      const exp = +params['exp'];

      // Validiere die Parameter
      if (!access || !refresh || !exp || isNaN(exp)) {
        this.auth.logout();
        return;
      }

      this.auth.setToken(access, refresh, exp);

      // Navigiere mit Zeitverzögerung und Clear History
      setTimeout(() => {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
        this.router.navigateByUrl(redirectUrl, {replaceUrl: true})
          .then(() => sessionStorage.removeItem('redirectAfterLogin'));
      }, 100);
    });
  }
}
