import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCart } from '../../models/shopping-cart';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ProductQuantityComponent } from "../product-quantity/product-quantity.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ProductQuantityComponent, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart$: Observable<ShoppingCart>
  private cartSubscription: Subscription | undefined
  shoppingCartItemCount: number = 0 
  shoppingCartItems: any[] = []
  totalCartPrice: number = 0

  constructor(private shoppingCartService: ShoppingCartService, private cdr: ChangeDetectorRef, private router: Router) {
    this.cart$ = this.shoppingCartService.getCart()
  }

  ngOnInit(){
    this.cartSubscription = this.shoppingCartService.getCart().subscribe(cart => {
      this.shoppingCartItems = []
      this.totalCartPrice = 0
      let shoppingCartItemCount = 0
      if(cart.items){
        for (let productId of Object.keys(cart.items)) {
          shoppingCartItemCount += cart.items[productId].quantity
          cart.items[productId].totalPrice =  cart.items[productId].quantity *  cart.items[productId].price
          this.totalCartPrice += cart.items[productId].totalPrice
          this.shoppingCartItems.push(cart.items[productId])
        }
      }
      this.shoppingCartItemCount = shoppingCartItemCount  
      this.cdr.detectChanges(); //aggiungo un change detector per aggiornare la view
    })
  }

  clearCart(){
    this.shoppingCartService.clearCart()
  }

  checkOut(){
    this.router.navigate(['/check-out'])
  }

  ngOnDestroy(): void {
    if(this.cartSubscription) {this.cartSubscription.unsubscribe()}
  }
}
