import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { filter, Observable } from 'rxjs';
import { UserData } from '../models/userdate.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private store: Firestore, private auth: Auth) { }

  private usersCollection = collection(this.store,'users');
  usersData = collectionData(this.usersCollection) as Observable<UserData[]>;
  
  saveUserData(userData:UserData) {
    addDoc(this.usersCollection,userData);
  }

  async getCurrentUserData() {
    return new Promise<UserData>((resolve, reject) => {
      let unsub = this.usersData.subscribe(users => {
        const currentUserData = users.find(user => user.uid === this.auth.currentUser?.uid);
        if (currentUserData) {
          resolve(currentUserData);
        } else {
          reject();
        }
        unsub.unsubscribe();
      })
    })
  }

}
