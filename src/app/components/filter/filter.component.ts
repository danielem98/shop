import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product';
import { Observable, Subject, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnDestroy {
  products: Product[] = []
  categories$: Observable<any>
  private destroy$ = new Subject<void>();

  @Output() productsFiltered = new EventEmitter<Product[]>()

  constructor(private productService: ProductService, private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories()
    this.loadProducts()
  }

  ngOnInit() {
    this.loadProducts()
  }

  private loadProducts() {
    this.productService.getAll().pipe(
      tap(products => {
        this.products = [...products];
        this.emitProducts(products); // Emetti tutti i prodotti all'inizio
      })
    ).subscribe();
  }

  onCategoryChange(category: any) {
    if (!category) {
      this.emitProducts(this.products);
      return;
    }

    const filtered = this.products.filter(product => 
      product.category === category.name.toLowerCase()
    );
    this.emitProducts(filtered);
  }

  private emitProducts(products: Product[]) {
    this.productsFiltered.emit([...products]); // Emetti una nuova copia dell'array
  }

  ngOnDestroy() {
    this.destroy$.next(); 
    this.destroy$.complete();
  }
}
