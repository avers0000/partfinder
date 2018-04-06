import { Component, OnInit, Input } from '@angular/core';
import { User, UserTypeAlias, UserStatusAlias, UserStatus, UserType } from '../../../shared/user.model';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() user: User;
  userTypeAlias: string[] = UserTypeAlias;
  userStatusAlias: string[] = UserStatusAlias;
  currentType: UserType;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.currentType = this.user.type;
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

  getToggleStatusCss() {
    return {
      'badge-success': this.user.status !== UserStatus.Active,
      'btn-danger': this.user.status === UserStatus.Active
    };
  }

  toggleStatusTitle(): string {
    return (this.user.status === UserStatus.Active) ? 'Деактивировать' : ((this.user.status === UserStatus.Deleted) ? 'Восстановить' :'Активировать');
  }

  toggleStatus() {
    const newStatus: UserStatus = (this.user.status === UserStatus.Active) ? UserStatus.Inactive : UserStatus.Active;

    this.userService.updateUserStatus(this.user.userId, newStatus).subscribe((response: any) => 
      {
        this.user.status = newStatus;
      },
      (error) => {
        alert('Не удалось изменить статус!');
      }
    );
  }

  onTypeChange() {
    const oldType = this.user.type;
    this.userService.updateUserType(this.user.userId, this.currentType).subscribe((response: any) =>
      {
        this.user.type = this.currentType;
      },
      (error) => {
        alert('Не удалось изменить тип!');
      }
    );
  }
}
