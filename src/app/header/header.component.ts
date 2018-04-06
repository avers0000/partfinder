import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  show:boolean = false;
  authSubscription: Subscription;
  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.userChanged.subscribe((user: User) => {
      this.user = user;
    });
  }

  toggleCollapse() {
    this.show = !this.show
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
