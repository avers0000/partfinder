import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/user.model';
import { UserProfile } from '../../shared/user-profile.model';
import { CanComponentDeactivate } from '../../shared/can-deactivate-guard.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  header: string = 'Профиль';
  profileForm: FormGroup;
  errorMessage: string = null;
  success: boolean = false;
  user: User;
  private authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.initForm();

    this.authSubscription = this.authService.userChanged.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.initForm();
      }
      else {
        this.router.navigate(['/']);
      }
    });
  }

  initForm() {
    let phoneArray: FormControl[] = [];
    if (this.user && this.user.profile && this.user.profile.phones) {
      for (const phone of this.user.profile.phones) {
        phoneArray.push(new FormControl(phone));
      }
    }
    this.profileForm = new FormGroup({
      'email': new FormControl((this.user) ? this.user.email : null),
      'firstName': new FormControl((this.user && this.user.profile) ? this.user.profile.firstName : null),
      'lastName': new FormControl((this.user && this.user.profile) ? this.user.profile.lastName : null),
      'email2': new FormControl((this.user && this.user.profile) ? this.user.profile.email2 : null, this.extraEmailValidator.bind(this)),
      'address': new FormControl((this.user && this.user.profile) ? this.user.profile.address : null),
      'phones': new FormArray(phoneArray)
    });
  }

  onSave() {
    this.success = false;
    this.errorMessage = null;
    let profile: UserProfile = new UserProfile();
    profile.firstName = this.profileForm.get('firstName').value;
    profile.lastName = this.profileForm.get('lastName').value;
    profile.email2 = this.profileForm.get('email2').value;
    profile.address = this.profileForm.get('address').value;

    let phones: string[] = [];
    for (const phoneControl of (<FormArray>this.profileForm.get('phones')).controls) {
      if (phoneControl.value) phones.push(phoneControl.value);
    }
    profile.phones = phones;

    if (this.user && this.user.userId) {
      this.authService.updateProfile(profile).subscribe(
        (response: any) => {
          this.initForm();
          this.success = true;
        },
        (error) => {
          console.log(error);
          this.errorMessage = error.message;
        }
      )
    }
  }

  onCancel() {
    this.success = false;
    this.errorMessage = null;
    this.initForm();
  }

  setFormDirty() {
    this.profileForm.markAsDirty();
  }

  onAddPhone() {
    const control = new FormControl(null);
    (<FormArray>this.profileForm.get('phones')).push(control);
    this.setFormDirty();
  }

  onRemovePhone(i: number) {
    (<FormArray>this.profileForm.get('phones')).removeAt(i);
    this.setFormDirty();
  }

  extraEmailValidator(control: FormControl): {[s: string]: boolean} {
    const value = control.value;
    if (this.profileForm) {
      if (value) {
        const compareValue = this.profileForm.get('email').value;
        if (value.trim() === compareValue) {
          return {'alreadyUsed': true}
        }
        else if (value.trim().length > 0) {
          return Validators.email(control);
        }
      }
    }
    return null;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user && this.profileForm && this.profileForm.dirty) {
      return confirm('Изменения не были сохранены. Хотите отменить Ваши изменения?');
    }
    else {
      return true;
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
