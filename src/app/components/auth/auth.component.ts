import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required])
  });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  userSubscription: Subscription;

  constructor(public authService: AuthService,
    public databaseService: DatabaseService,
    public router: Router) {

    this.userSubscription = authService.user$.subscribe((user) => {
      if(user !== null) {
        console.log(databaseService.usersData$);
        router.navigate(['/home']);
      }
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  async onRegisterSubmit() {
    let email = this.registerForm.value.email!!; // if it null it converted to false
    let password = this.registerForm.value.password!!;
    let phone = this.registerForm.value.phone!!;
    let birthday = this.registerForm.value.birthday!!;
    let address = this.registerForm.value.address!!;

    const uid = await this.authService.singUp(email, password);

    if (uid) {
      this.databaseService.saveUserData({
        email,
        phone,
        address,
        birthday,
        uid
      })
    }
  }

  onSignInSubmit() {
    let email = this.loginForm.value.email!!; // if it null it converted to false
    let password = this.loginForm.value.password!!;

    this.authService.signIn(email, password);
  }

  ngOnInit(): void {
  }

}
