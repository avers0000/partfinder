import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  header: String = 'Регистрация';
  errorMessage: String = null;
  success: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignup(form: NgForm): void {
    this.errorMessage = null;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signupUser(email, password)
      .then((response) => {
        console.log(response);
        this.success = true;
      })
      .catch((error) => {
        if (error && error.message) this.errorMessage = error.message;
      });
    
  }

}
