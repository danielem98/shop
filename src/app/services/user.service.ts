import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { getDatabase, set, ref, get, child} from 'firebase/database';
import { from, map, Observable } from 'rxjs';
import { AppUser } from '../models/app-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  saveUser(user: User) {
    const db = getDatabase();
    let isAdmin: boolean = false 
    if (user.uid == "Hpzhn0A9xWV4vKXGIIWptLShSa13"){
      isAdmin = true
    }
    set(ref(db, 'users/' + user.uid), {
      name: user.displayName,
      email: user.email,
      isAdmin: isAdmin
    });
  }

  getUser(userId: string): Observable<AppUser>{
    const dbRef = ref(getDatabase());
    const userRef = child(dbRef, `users/${userId}`)

    return from(get(userRef)).pipe(
      map(user =>{
        if(user.exists()){
          return user.val() as AppUser
        }else{
          throw new Error('No data aviable')
        }
      })
    )
  }
}
