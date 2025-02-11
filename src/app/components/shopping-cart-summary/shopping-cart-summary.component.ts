import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ShoppingCart } from '../../models/shopping-cart';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'shopping-cart-summary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shopping-cart-summary.component.html',
  styleUrl: './shopping-cart-summary.component.css'
})
export class ShoppingCartSummaryComponent implements OnChanges {
  @Input('cart') cart!: ShoppingCart
  cartArray: any
  public shoppingCartItemCount = 0
  public shoppingTotalPrice = 0

  ngOnChanges(changes: SimpleChanges){
    if(changes['cart'] && this.cart.items){
      this.cartArray = Object.values(this.cart.items)
      this.shoppingCartItemCount = this.cartArray.reduce((total: number, product: any) => total + (product.quantity || 0), 0)
      this.shoppingTotalPrice = this.cartArray.reduce((total: number, product: any) => total + (product.quantity * product.price || 0), 0)

      console.log("Aggiornato cartArray:", this.cartArray);
      console.log("Totale prodotti nel carrello:", this.shoppingCartItemCount)
      console.log("Totale prezzo prodotti nel carrello:", this.shoppingTotalPrice)
    }
  }

}
