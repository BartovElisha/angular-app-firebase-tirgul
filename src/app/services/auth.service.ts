import { Injectable, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Unsubscribe } from '@angular/fire/firestore';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService  implements OnDestroy {

  user$ : Observable<User | null>;
  private unsubscribe: Unsubscribe | undefined;

  constructor(private auth: Auth) { 
    // ערך שניתן להעזין לו
    this.user$ = new Observable<User | null>((subscriber) => {
      auth.onAuthStateChanged((user) => {
        subscriber.next(user);
      })
    }); 


  }
  ngOnDestroy(): void {
    if(this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // registration new user in firesbase
  async singUp(email: string, password: string) {
    try {
      const registrationResult = await createUserWithEmailAndPassword(this.auth, email,password);
      alert(`User ${registrationResult.user.email} was registered`);
      return registrationResult.user.uid;
    }
    catch (error: any) {
      console.log(error);
      alert(error.message);
      return null;
    }
  }

  // registration new user in firesbase
  async signIn(email: string, password: string) {
    try {
      const loginResult = await signInWithEmailAndPassword(this.auth, email,password);
      alert(`User ${loginResult.user.email} was logedin`);
    }
    catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  }

  signOut() {
    this.auth.signOut();
    alert('Loged Out Successifuly');
  }

}
