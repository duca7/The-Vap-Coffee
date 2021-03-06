import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router) {
  }

  user$: Observable<any>;

  checkCurrentUser() {
    return this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async logOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  updateUserData({ uid, email, photoURL }: User) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${uid}`);
    const data = {
      uid,
      email,
      photoURL
    };
    return userRef.set(data, { merge: true });
  }


}

