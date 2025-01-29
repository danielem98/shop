import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { ShoppingCartService } from '../../services/shopping-cart.service';


@Component({
  selector: 'product-quantity',
  standalone: true,
  imports: [],
  templateUrl: './product-quantity.component.html',
  styleUrl: './product-quantity.component.css'
})
export class ProductQuantityComponent {
  @Input() product!: Product
  @Input('shopping-cart') shoppingCart: any

  constructor(private cartService: ShoppingCartService){}

  addToCart() {
    this.cartService.addToCart(this.product)
  }

  removeFromCart() {
    this.cartService.removeFromCart(this.product)
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
