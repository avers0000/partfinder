import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { DropdownCloseElementDirective } from '../../shared/dropdown-close-element.directive';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild(DropdownCloseElementDirective) 
  private closeDropdownEl: DropdownCloseElementDirective;

  success: boolean = false;
  errorMessage: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    
  }

  onSignin(form: NgForm): void {
    this.errorMessage = null;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signinUser(email, password)
      .then((user: User) => {
        if (user) {
          form.reset();
          this.closeDropdownEl.closeDropdown();
          this.success = true;
        }
        else {
          this.errorMessage = 'Пользователь не найден';
        }
      })
      // .then((response: any) => {
      //     form.reset();
      //     this.closeDropdownEl.closeDropdown();
      //     this.success = true;
      // })
      .catch((error) => {
        this.errorMessage = error;
      });
    
  }

}
