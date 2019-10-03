import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config/config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  request: string;
  apiBasePath: any;
  token: string;

  constructor(private httpClient: HttpClient) {
    this.apiBasePath = Config.apipath[environment.apiserver];

  }

  loadToken() {
    this.token = localStorage.getItem('id_token');
  }

  setHeaderWithAuthorization() {
    const myHeaders = new HttpHeaders();
    this.loadToken();
    myHeaders.append('Authorization', this.token);
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', 'application/json');
    return (myHeaders);
  }

  getWomenscloths(apiType, endPoint, data) {
    const apiPath = this.apiBasePath + Config.module[apiType].endpoints[endPoint];
    console.log(apiPath);
    const postHeader = this.setHeaderWithAuthorization();
    return this.httpClient.get(apiPath, { headers: postHeader });

  }

  getAllProducts(apiType, endPoint, data) {
    const apiPath = this.apiBasePath + Config.module[apiType].endpoints[endPoint];
    console.log(apiPath);
    const postHeader = this.setHeaderWithAuthorization();
    return this.httpClient.get(apiPath, { headers: postHeader });

  }

  getProductsbyname(apiType, endPoint, data) {
    const apiPath = this.apiBasePath + Config.module[apiType].endpoints[endPoint];
    const postHeader = this.setHeaderWithAuthorization();
    return this.httpClient.post(apiPath, data, { headers: postHeader });

  }

  getLoggedUSerDetails(apiType, endPoint, data) {
    const apiPath = this.apiBasePath + Config.module[apiType].endpoints[endPoint];
    console.log(apiPath);
    const postHeader = this.setHeaderWithAuthorization();
    return this.httpClient.get(apiPath, { headers: postHeader });

  }


}

