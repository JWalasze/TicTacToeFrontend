import { Component } from '@angular/core';
import { UserAccess } from './utils/wizard';
import { UserService } from './utils/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  
  userAccess = UserAccess.SignIn;

  userAccessMethods = { signUp: UserAccess.SignUp, signIn: UserAccess.SignIn };

  constructor(private userService: UserService, private router: Router) { }

  receiveUserAccessChange(userAccess: UserAccess): void {
    this.userAccess = userAccess;
  }

  receiveUserAuthentication(): void {
    this.router.navigate(["/wait_room"]);
  }
}
