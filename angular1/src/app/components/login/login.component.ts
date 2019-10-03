import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/providers/common.service';
import { messages } from 'src/app/config/messages';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/providers/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: ''
  };
  userdata: any;
  token: any;

  constructor(private commonService: CommonService, private routes: Router, private loginService: LoginService) { }

  ngOnInit() {
  }

  loginSubmit(user) {
    console.log(user);
    this.loginService.login('api', 'login', user).subscribe(res => {
      console.log(res);
      if (res.status === 200) {
        this.userdata = res.body['user'];
        this.token = res.body['token'];
        console.log('1234', this.token);
        this.loginService.storeUserData(this.token, this.userdata);
        console.log('1');
        this.routes.navigate(['/']);
       } else {
        alert(res);
      }

     }, err => {
      alert(err.error.msg);
    });

  }

}
