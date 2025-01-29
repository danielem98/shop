import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { async, of, Subscription, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AppUser } from '../../models/app-user';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'bs-navbar',
  standalone: true,
  imports: [RouterModule, NgbModule, CommonModule],
  templateUrl: './bs-navbar.component.html',
  styleUrl: './bs-navbar.component.css'
})
export class BsNavbarComponent implements OnInit, OnDestroy{
  appUser: AppUser|null = null
  private userSubscription!: Subscription
  private cartSubscription: Subscription | undefined
  public shoppingCartItemCount: number = 0


  constructor(private authService: AuthService, private userService: UserService ,private router: Router, private shoppingCartService: ShoppingCartService,private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    //monitoraggio dello stato di autenticazione 
    // this.userSubscription = this.authService.user$.subscribe(user => {
    //   this.user = user
    // })
    this.userSubscription = this.authService.user$.pipe(
      switchMap(user => {
        if (user) return this.userService.getUser(user.uid);
        return of(null);
      })
    ).subscribe(appUser => this.appUser = appUser)

    this.cartSubscription = this.shoppingCartService.getCart().subscribe(cart => {
      let shoppingCartItemCount = 0
      if(cart.items){
        for (let productId of Object.keys(cart.items)) {
          shoppingCartItemCount += cart.items[productId].quantity
        }
      }
      this.shoppingCartItemCount = shoppingCartItemCount  
      this.cdr.detectChanges(); //aggiungo un change detector per aggiornare la view
    })
  }

  logout(){
    this.authService.logout().then(()=>{
      this.router.navigate([''])
    })
  }

  ngOnDestroy(): void {
    //rimozione sottoscrizione
    if(this.userSubscription) {this.userSubscription.unsubscribe()}
    if(this.cartSubscription) {this.cartSubscription.unsubscribe()}
  }
}
