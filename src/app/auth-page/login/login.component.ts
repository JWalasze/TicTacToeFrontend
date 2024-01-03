import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../../../environment';
import { UserAccess } from '../utils/wizard';
import { UserService } from '../utils/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output()
  userAccessEvent = new EventEmitter<UserAccess>();

  @Output()
  userAuthenticationEvent = new EventEmitter();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    Amplify.configure({
      Auth: environment.cognito
    });

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }


  ngOnInit(): void {
    console.log("...");
  }

  signIn(): Promise<any> {
    //"Player96", "Moje_haslo11!"
    return Auth.signIn(this.username?.value, this.password?.value)
      .then(() => {
        console.log("Udalo sie");
        console.log(Auth.currentSession());
        this.userService.authenticateUser(this.password?.value, this.username?.value)
        this.userAuthenticationEvent.emit();
      })
      .catch(() => {
        console.log("Mamy error");
      });
  }

  login() {
    console.log("Login clicked");
    this.signIn();
    this.userAuthenticationEvent.emit();
  }

  createProfile() {
    console.log("Profile clicked");
    this.userAccessEvent.emit(UserAccess.SignUp);
  }
}
