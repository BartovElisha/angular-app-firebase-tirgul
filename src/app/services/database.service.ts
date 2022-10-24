import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore, updateDoc } from '@angular/fire/firestore';

import { where } from '@firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { Note } from '../models/note.model';
import { UserData } from '../models/userdate.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // private usersCollection is pointer to collection 'users' 
  private usersCollection = collection(this.store, 'users');

  usersData$: Subject<UserData> = new Subject();
  userNotes$: Subject<Note[]> = new Subject();

  constructor(private store: Firestore, private auth: Auth) {
    // User State changed (Logged in / Logged out)
    // logged out -----> user === null
    // logged in  -----> user !== null
    auth.onAuthStateChanged(async (user) => {
      if(user !== null) {
        try {
          const userDetails = await this.getCurrentUserData(user)
          const userNotes = await this.getCurrentUserNotes(user)
          this.usersData$.next(userDetails);
          this.userNotes$.next(userNotes);
        } 
        catch (e) {
          console.log(e)
        }
      }
    })
  }

  saveUserData(userData: UserData) {
    addDoc(this.usersCollection, userData);
  }

  async saveNote(note: Note) {
    const uid = this.auth.currentUser!!.uid
    // private usersCollection is pointer to collection 'users' 
    let userNotesCollection = collection(this.store, `notes/${uid}/notes`);
    const newNoteDocument = await addDoc(userNotesCollection, note);
    updateDoc(newNoteDocument, { nid: newNoteDocument.id });
  }

  private async getCurrentUserData(currentAuthUser: User) {
    return new Promise<UserData>((resolve, reject) => {
      let unsub = collectionData(this.usersCollection).subscribe(users => {
        const currentUserData = users.find((user: any) => user.uid === currentAuthUser.uid);
        if (currentUserData) {
          resolve(currentUserData as UserData);
        } else {
          reject();
        }
        unsub.unsubscribe();
      })
    })
  }

  private async getCurrentUserNotes(currentAuthUser: User) {
    return new Promise<Note[]>(async (resolve, reject) => {
      let unsub = collectionData(collection(this.store, `notes/${currentAuthUser.uid}/notes`)).subscribe(notes => {
        if (notes) {
          resolve(notes as Note[]);
        } else {
          reject();
        }
        unsub.unsubscribe();
      })
    })
  }

}
