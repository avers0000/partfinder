import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User, UserType, UserStatus, UserTypeAlias, UserStatusAlias } from '../../shared/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userTypeAlias: string[] = UserTypeAlias;
  userStatusAlias: string[] = UserStatusAlias;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.GetUsersAsync().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  getStatusCss(status) {
    return {
      'badge-danger': status == UserStatus.Inactive,
      'badge-success': status == UserStatus.Active,
      'badge-secondary': status == UserStatus.Deleted
    };
  }

  getTypeCss(type) {
    return {
      'badge-light': type == UserType.User,
      'badge-dark': type == UserType.Admin
    };
  }

  delete(userId: string) {
    if (confirm(`Подтвердите удаление пользователя`)) {
      this.userService.updateUserStatus(userId, UserStatus.Deleted).subscribe((response: any) => 
        {
          for (let user of this.users) {
            if (user.userId === userId) user.status = UserStatus.Deleted;
          }
        },
        (error) => {
          alert('Не удалось изменить статус!');
        }
      );
    }
  }

  navigateUser(userId) {
    this.router.navigate([userId], { relativeTo: this.route });
  }
}
