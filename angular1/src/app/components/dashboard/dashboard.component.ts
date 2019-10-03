import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/providers/common.service';
import { Router } from '@angular/router';
import { messages } from 'src/app/config/messages';
import { UserService } from 'src/app/providers/user.service';

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
  term: any;

  msgTosend='Iam your parent';
  products: { prd_id: string; prd_name: string; prd_price: string; prd_img: string; }[];



  constructor(private routes: Router, private commonService: CommonService, private userService: UserService) { }

  ngOnInit() {
    this.getWomenscloths();
    console.log('1234', this.products);
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

  getWomenscloths() {
    this.products = [
      { prd_id: '01', prd_name: 'Jeans', prd_price: '300', prd_img: 'product01.jpg' },
      { prd_id: '02', prd_name: 'Kurta', prd_price: '3600', prd_img: 'product02.jpg' },
      { prd_id: '03', prd_name: 'top', prd_price: '600', prd_img: 'product03.jpg' },
      { prd_id: '04', prd_name: 'sari', prd_price: '2600', prd_img: 'product04.jpg' }
    ];
    this.userService.getWomenscloths('api', 'getwomenscloth', '').subscribe(res => {
    });

  }

  getAllProducts() {

    this.userService.getAllProducts('api', 'getallproducts', '').subscribe(res => {
    });

  }

 

}
