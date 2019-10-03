import { Injectable } from '@angular/core';
import { Config } from '../config/config';
import { environment } from 'src/environments/environment';

import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiBasePath: any;
  token: any;
  ls: any;
  request: string;

  constructor(private httpClient: HttpClient, private routes: Router) {
    this.apiBasePath = Config.apipath[environment.apiserver];
   }

  apiEndPointsCall(apiType, endPoint, data) {
    this.request = '';
    this.request = data;
    console.log('this.request', this.request);
    this.apiBasePath = Config.apipath[environment.apiserver];
    const apiPath = this.apiBasePath + Config.module[apiType].endpoints[endPoint];

    // this.token = this.ls.get('ls_token');
    const Headers = new HttpHeaders({
      // tslint:disable-next-line:object-literal-key-quotes
      // 'Authorization': this.token,
      // tslint:disable-next-line:object-literal-key-quotes
      'Content-Type': 'application/json',
      // tslint:disable-next-line:object-literal-key-quotes
      'Accept': 'application/json'
    });

    const postHeader: any = { headers: Headers, responseType: 'json', observe: 'response' };
    switch (endPoint) {
      /* getSensorSpaceList functn for get all sesnsor space list*/
      case 'register':
        return this.httpClient.post(apiPath, data, { headers: Headers, responseType: 'json', observe: 'response' });

    }
  }

  loadToken() {
    this.token = localStorage.getItem('ls_token');
  }

  logout(apiType, endPoint) {
 
  }
}
