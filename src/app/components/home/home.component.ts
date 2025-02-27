import { Component } from '@angular/core';
import { FilterComponent } from "../filter/filter.component";
import { ProductsComponent } from "../products/products.component";
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home',
  standalone: true,
  imports: [FilterComponent, ProductsComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  products: Product[] = [];

  onProductsFiltered(products: Product[]) {
    this.products = [...products];
  }
}
