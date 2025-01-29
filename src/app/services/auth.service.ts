import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, User} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { browserSessionPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //inizializzo l'instanza con valore null
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)
  //creo una variabile pubblica per far si che i vari componenti possano iscriversi senza poter modificare il contenuto del userSubject
  public user$: Observable<User| null> = this.userSubject.asObservable()
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
}
