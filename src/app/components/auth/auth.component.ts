import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { UserData } from 'src/app/models/userdate.model';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  registerForm = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    birthday: new FormControl('',[Validators.required]),
    address: new FormControl('',[Validators.required])
  });

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });

  userData$: Observable<UserData | null>;
  userDataSub: Subscription | undefined;

  constructor(public authService: AuthService, private databaseService:DatabaseService) {

  this.userData$ = new Observable(subscribe => {
      this.userDataSub = authService.user$.subscribe(async user => {
        if (user) {
          const data = await databaseService.getCurrentUserData();
          subscribe.next(data);
        }
        else {
          // if user disconected 
          subscribe.next(null);
        }
      })
    })

  }
  ngOnDestroy(): void {
    if(this.userDataSub) {
      this.userDataSub.unsubscribe();
    }    
  }

  async onRegisterSubmit() {
    let email = this.registerForm.value.email!!; // if it null it converted to false
    let password = this.registerForm.value.password!!;
    let phone = this.registerForm.value.phone!!;
    let birthday = this.registerForm.value.birthday!!;
    let address = this.registerForm.value.address!!;

    const uid = await this.authService.singUp(email,password);
    
    if(uid) {
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

    this.authService.signIn(email,password);    
  } 

  ngOnInit(): void {
  }

}
