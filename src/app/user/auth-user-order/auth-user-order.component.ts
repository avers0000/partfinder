import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Data } from '@angular/router';

import { Order } from '../../shared/order.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-auth-user-order',
  templateUrl: './auth-user-order.component.html',
  styleUrls: ['./auth-user-order.component.css']
})
export class AuthUserOrderComponent implements OnInit {
  order: Order;
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.order = data["order"];
    });
  };
  

}
