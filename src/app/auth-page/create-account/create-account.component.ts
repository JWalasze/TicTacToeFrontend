import { Component, EventEmitter, Output } from '@angular/core';
import { UserAccess } from '../utils/wizard';
import { Amplify, Auth } from 'aws-amplify';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  @Output()
  userAccessEvent = new EventEmitter<UserAccess>();

  @Output()
  userAuthenticationEvent = new EventEmitter();

  signUpForm: FormGroup;

  confirmationForm: FormGroup;

  isConfirmationOccured = false;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.confirmationForm = this.fb.group({
      code: ['', Validators.required]
    });
  }

  get username() {
    return this.signUpForm.get('username');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get code() {
    return this.confirmationForm.get('code');
  }

  confirmSignUp(): Promise<any> {
    console.log("CODE: " + this.code?.value);
    return Auth.confirmSignUp(this.email?.value, this.code?.value);
  }

  signUp(): Promise<unknown> {
    return Auth.signUp({
      username: this.username?.value,
      password: this.password?.value,
      attributes: {
        email: this.email?.value,
      }
    }).then(() => {
      console.log("jest git");
      this.isConfirmationOccured = true;
    }).catch(() => {
      console.log("mamy error");
    });
  }

  back() {
    console.log("ok");
    this.userAccessEvent.emit(UserAccess.SignIn);
  }
}
