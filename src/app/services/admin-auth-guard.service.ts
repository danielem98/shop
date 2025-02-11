import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService{

  constructor(private auth: AuthService, private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user$.pipe(
      //aspetta che firebase abbia caricato lo stato di autenticazione
      filter(user => user !== undefined),
      take(1),
      switchMap(user => {
        if (user) {
          // Recupera i dati dell'utente dal database
          return this.userService.getUser(user.uid).pipe(
            map(appUser => {
              console.log('ruolo utente', appUser);
              if (appUser.isAdmin) {
                console.log('AdminAuthGuard - accesso concesso')
                return true;
              } else {
                console.log('AdminAuthGuard - Accesso negato, reindirizzamento')
                this.router.navigate(['']);
                return false;
              }
            })
          );
        } else {
          console.log('admin-auth-guard: utente non autenticato reindirizzamento a login');
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}