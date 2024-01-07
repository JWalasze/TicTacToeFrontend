import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../../../environment';
import { UserAccess } from '../utils/wizard';
import { UserService } from '../utils/user.service';
import { PlayerService } from '../utils/player.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output()
  userAccessEvent = new EventEmitter<UserAccess>();

  @Output()
  userAuthenticationEvent = new EventEmitter();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private playerService: PlayerService) {
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

  signIn(): Promise<unknown> {
    return Auth.signIn(this.username?.value, this.password?.value)
      .then(() => {
        console.log("User is signed in!");
        console.log(Auth.currentSession());
        this.playerService.getPlayerIdByUsername(this.username?.value).subscribe((playerId) => {
          this.userService.authenticateUser(playerId, this.username?.value)
          this.userAuthenticationEvent.emit();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  login() {
    this.signIn();
  }

  createProfile() {
    this.userAccessEvent.emit(UserAccess.SignUp);
  }
}
