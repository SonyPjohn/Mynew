import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/providers/common.service';
import { messages } from 'src/app/config/messages';
import { Router } from '@angular/router';

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

  constructor(private commonService: CommonService, private routes: Router) { }

  ngOnInit() {
  }

  loginSubmit(user) {
    console.log(user);
    this.commonService.apiEndPointsCall('api', 'login', this.user).subscribe(res => {
      console.log(res);
      if (res.status === 200) {
        this.routes.navigate(['/']);
       } else {
        alert(res);
      }

     }, err => {
      alert(err.error.msg);
    });

  }

}
