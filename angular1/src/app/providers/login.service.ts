import { Injectable } from '@angular/core';

import { Config } from '../config/config';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiBasePath: any;
  ls: any;

  constructor(private httpClient: HttpClient) {
    this.apiBasePath = Config.apipath[environment.apiserver];
  }

  login(apiType, endPoint, data) {
    const apiPath = this.apiBasePath + Config.module[apiType].endpoints[endPoint];
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // tslint:disable-next-line:object-literal-key-quotes
      'Accept': 'application/json',
      // tslint:disable-next-line:object-literal-key-quotes
      // 'Authorization': base64Token
    });
    console.log('dd   ', apiPath);
    return this.httpClient.post(apiPath, data, { headers: myHeaders, responseType: 'json', observe: 'response' });
  }

  storeUserData(token, data) {
    localStorage.setItem('ls_token', token);
    localStorage.setItem('ls_user_data', JSON.stringify(data));

  }

  logout() {
    localStorage.clear();

  }


}
