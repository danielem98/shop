import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from "../product-cart/product-card.component";
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = []
  productsFiltered: Product[] = []
  categories$: Observable<any>
  selectedCategory: string | undefined
  cart: any
  subscription: Subscription | undefined

  constructor(private productService: ProductService, private categoryService: CategoryService, private shoppingCartService: ShoppingCartService) {

    this.productService.getAll().subscribe(products => {
      this.products = products
      this.productsFiltered = products
    })
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(){
    this.subscription = (this.shoppingCartService.getCart()).subscribe(cart=> {
      this.cart = cart || {items:{}}
    })
  }

  onCategoryChange(category: any){
    if (!category || !category.name) {
      this.productsFiltered = this.products
      return
    }
    this.productsFiltered = this.products.filter(product => {
      return product.category === category.name.toLowerCase()
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
