import { Component, EventEmitter, Output } from '@angular/core';
import { UserAccess } from '../utils/wizard';
import { Auth } from 'aws-amplify';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../utils/user.service';
import { PlayerService } from '../utils/player.service';

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

  constructor(private fb: FormBuilder, private userService: UserService, private playerService: PlayerService) {
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

  confirmSignUp(): Promise<unknown> {
    console.log("CODE: " + this.code?.value);
    this.playerService.addNewPlayer(this.username?.value, this.password?.value).subscribe((playerId) => {
      console.log("Zwrocone: " + playerId);
      this.userService.authenticateUser(playerId, this.username?.value)
      this.userAuthenticationEvent.emit();
    });
    return Auth.confirmSignUp(this.username?.value, this.code?.value
    ).then(() => {
      console.log("Verification completed successfully!");
      //this.playerService.addNewPlayer(this.username?.value, this.password?.value).subscribe((playerId) => {
      //  console.log("Zwrocone: " + playerId);
      //  this.userService.authenticateUser(playerId, this.username?.value)
      //  this.userAuthenticationEvent.emit();
      //});
      }).catch((error) => {
        console.error(error);
      });
  }

  signUp(): Promise<unknown> {
    return Auth.signUp({
      username: this.username?.value,
      password: this.password?.value,
      attributes: {
        email: this.email?.value,
      }
    }).then(() => {
      console.log("User is signed up!");
      this.isConfirmationOccured = true;
    }).catch((error) => {
      console.error(error);
    });
  }

  back() {
    this.userAccessEvent.emit(UserAccess.SignIn);
  }
}
