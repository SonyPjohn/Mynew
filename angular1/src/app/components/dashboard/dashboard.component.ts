import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/providers/common.service';
import { Router } from '@angular/router';
import { messages } from 'src/app/config/messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user = {
    name: '',
    mobile: '',
    password: '',
    email: ''
  };

  constructor(private routes: Router, private commonService: CommonService) { }

  ngOnInit() {
  }

  register() {
    console.log(this.user);
    this.commonService.apiEndPointsCall('api', 'register', this.user).subscribe(res => {
      console.log(res);
      if (res.status === 200) {
      alert(messages.common.success.insert);
      this.routes.navigate(['/login']);
     } else {
       alert(res);
     }
    }, err => {
      alert(err.error.msg);
    });

  }

}
