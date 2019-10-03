import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/providers/common.service';
import { messages } from 'src/app/config/messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 

  constructor(private commonService: CommonService, private routes: Router,) { }

  ngOnInit() {
  }

}
