import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-callback',
  template: `<p>Logging you in...</p>`
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.auth.exchangeCode(code);
      }
    });
  }
}
