import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  isVisible = true;
  products: Product[] = [];
  filteredProducts: any[] = [];
  subscription: Subscription | undefined;

  constructor(private router: Router, private productService: ProductService, private cdr: ChangeDetectorRef) {
  }
  
  ngOnInit(){
    // Resetta la visibilità quando il componente viene inizializzato
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Ripristina `isVisible` solo per la rotta principale
        this.isVisible = this.router.url === '/admin/products';
        console.log('isVisible dopo NavigationEnd:', this.isVisible, 'per rotta:', this.router.url);
      });

      this.subscription =  this.productService.getAll().subscribe(product => {
        this.filteredProducts = this.products = product

        //forzo il rilevamento dei cambiamenti per la visualizzazione dei prodotti dopo refresh
        this.cdr.detectChanges();
      })
  }

  invisible(){
    if (this.isVisible){
      this.isVisible= false
    }
  }

  filter(query: string){
    this.filteredProducts = (query) ? 
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) : 
      this.products;
  }

  ngOnDestroy(){
    this.subscription?.unsubscribe();
  }

}
