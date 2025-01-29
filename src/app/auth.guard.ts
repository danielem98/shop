import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)

  return authState(authService.getAuth()).pipe(
    take(1),  // Prende solo il primo valore emesso
    map(user => {
      console.log('utente nel auth guard', user)
      if (user) {
        // L'utente è loggato, può accedere alla rotta
        console.log("Utente loggato può accedere alla rotta")
        return of(true);
      } else {
        // L'utente non è loggato, reindirizza
        console.log("Utente non loggato, reindirizza")
        authService.redirectUrl = state.url
        router.navigate(['/login']);
        return false;
      }
    })
  )

};
