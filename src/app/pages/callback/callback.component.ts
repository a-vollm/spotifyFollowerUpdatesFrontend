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
    console.log('CallbackComponent initialized');
    this.route.queryParams.subscribe(params => {
      console.log('params');
      if (params['error']) {
        this.auth.logout();
        this.router.navigate(['/'], {queryParams: {error: params['error']}});
        return;
      }

      const access = params['access'];
      const refresh = params['refresh'];
      const exp = +params['exp'];

      if (!access || !refresh || isNaN(exp)) {
        this.auth.logout();
        this.router.navigate(['/'], {queryParams: {error: 'invalid_tokens'}});
        return;
      }

      this.auth.setToken(access, refresh, exp);
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      this.router.navigateByUrl(redirectUrl, {replaceUrl: true});
    });
  }
}
