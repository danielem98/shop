import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductQuantityComponent } from "../product-quantity/product-quantity.component";

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, ProductQuantityComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product
  @Input('shopping-cart') shoppingCart: any

  constructor(private cartService: ShoppingCartService){}

  addToCart() {
    this.cartService.addToCart(this.product)
  }

  getQuantity() {
    if (!this.shoppingCart || !this.shoppingCart.items) {
      console.warn("Carrello o items non definiti.");
      return 0;
    }
  
    const item = this.shoppingCart.items[this.product.key];
  
    return item ? item.quantity : 0;
  }

}
