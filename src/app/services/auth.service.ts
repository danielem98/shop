import { Injectable } from '@angular/core';
import { Auth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect, User} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
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
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
      this.monitorAuthState();
      console.log('Auth initialized');
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }

  private monitorAuthState(): void {
    onAuthStateChanged(this.auth, async (user) => {
      console.log('Auth state changed:', user);
      this.userSubject.next(user);

      if (user) {
        await this.userService.saveUser(user);
        this.handlePostLoginRedirect();
      }
    });
  }
  // private monitorAuthState(): void {
  //   //quando cambia stato viene aggiornato il behavior
  //   onAuthStateChanged(this.auth, (user) => {
  //     console.log('Auth state changed: ', user); // Verifica l'utente
  //     this.userSubject.next(user)

  //     if(user){
  //       console.log('Utente autenticato ', user)
  //       this.userService.saveUser(user)
  //     }else{
  //       console.log('Utente non autenticato')
  //     }
  //   })
  // }

  private async setPersistence():Promise<void>{
    //imposto la persistenza dell'autenticazione 
    await setPersistence(this.auth, browserLocalPersistence).then(()=>{
      console.log('Local persistence set')
    }).catch((error)=>{
      console.log('Error setting local persistence: ', error)
    })
  }

  login(): void{

    signInWithPopup(this.auth, new GoogleAuthProvider()).then(()=>{
      //reindirizzamento check-out dopo login se si porva ad entrare senza autenticazione
      this.handlePostLoginRedirect()
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

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(this.auth, provider);
      console.log('Google login successful:', result.user);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  private handlePostLoginRedirect(): void {
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
      this.redirectUrl = null;
    } else {
      this.router.navigate(['/']);
    }
  }

}
