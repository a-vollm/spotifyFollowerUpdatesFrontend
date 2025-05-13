import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor() {
  }

  setUid(uid: string) {
    localStorage.setItem('uid', uid);
  }
}
