import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { CommonService } from 'src/app/providers/common.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/providers/login.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {

  constructor(private userService: UserService, private loginService: LoginService, private routes: Router) { }

  ngOnInit() {
    this.userService.getLoggedUSerDetails('api', 'getloggeduser', '').subscribe(info => {
      console.log('ddd', info);
      if (info == null || info === '') {
        alert('Session Expired.. Login again');
        this.loginService.logout();
        this.routes.navigate(['/login']);
      }
    });
  }

  listbyname(data) {
    console.log(data);
    this.userService.getProductsbyname('api', 'getproductbyname', '').subscribe(res => {
    });

  }

  logout() {
    this.loginService.logout();
    this.routes.navigate(['/login']);
  }

}
