import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from "../product-cart/product-card.component";
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  selectedCategory: string | undefined
  cart: any
  subscription: Subscription | undefined
  @Input() products: Product[] = []
  
  constructor(private shoppingCartService: ShoppingCartService){}
  
  ngOnInit(){
    this.subscription = (this.shoppingCartService.getCart()).subscribe(cart=> {
      this.cart = cart || {items:{}}
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
