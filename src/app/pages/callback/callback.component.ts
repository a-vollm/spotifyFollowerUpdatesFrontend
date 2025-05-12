import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-callback',
  template: `<p>…</p>`
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    const p = this.route.snapshot.queryParamMap;
    const a = p.get('access');
    const r = p.get('refresh');
    const e = Number(p.get('exp'));
    if (a && r && e) {
      this.auth.setToken(a, r, e);
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
