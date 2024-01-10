import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from  '../api-url';


/*
  Generated class for the AuthenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient) {
  }

  getAuth(params) {
    return this.http.post(`${API_URL}/auth`, params);
  }

  setRegister(params) {
    return this.http.post(`${API_URL}/register`, params);
  }

  checkexistUsername(username) {
    return this.http.get(`${API_URL}/validate-username/${username}`);
  }
}
