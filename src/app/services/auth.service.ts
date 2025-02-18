import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, User} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { browserSessionPersistence, onAuthStateChanged, setPersistence, UserInfo } from 'firebase/auth';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //inizializzo l'instanza con valore undefined per far aspettare authguard che si connetta a firebase
  private userSubject: BehaviorSubject<User | null | undefined> = new BehaviorSubject<User | null | undefined>(undefined)
  //creo una variabile pubblica per far si che i vari componenti possano iscriversi senza poter modificare il contenuto del userSubject
  public user$: Observable<User| undefined> = this.userSubject.asObservable().pipe(map((user)=> user ? user : undefined))
  redirectUrl : string | null = null

  constructor(private auth: Auth, private router: Router, private userService: UserService) { 
    this.monitorAuthState()
    this.setPersistence()
  }

  private monitorAuthState(): void {
    //quando cambia stato viene aggiornato il behavior
    onAuthStateChanged(this.auth, (user) => {
      console.log('Auth state changed: ', user); // Verifica l'utente
      this.userSubject.next(user)

      if(user){
        console.log('Utente autenticato ', user)
        this.userService.saveUser(user)
      }else{
        console.log('Utente non autenticato')
      }
    })
  }

  private setPersistence():void{
    //imposto la persistenza dell'autenticazione 
    setPersistence(this.auth, browserSessionPersistence).then(()=>{
      console.log('Local persistence set')
    }).catch((error)=>{
      console.log('Error setting local persistence: ', error)
    })
  }

  login(): void{

    signInWithPopup(this.auth, new GoogleAuthProvider()).then(()=>{
      //reindirizzamento check-out dopo login se si porva ad entrare senza autenticazione
      if(this.redirectUrl){
        this.router.navigate([this.redirectUrl])
        this.redirectUrl = null
      }else{
        this.router.navigate([''])
      }
    }).catch((error)=>{
      console.log('error during login: ', error)
    })
  }

  logout(): Promise<void>{
    return this.auth.signOut()
  }

  public getAuth(){
    return this.auth
  }

  getCurrentUserId(): Promise<string | null> {
    return this.auth.currentUser ? Promise.resolve(this.auth.currentUser.uid) : Promise.resolve(null);
  }
}
