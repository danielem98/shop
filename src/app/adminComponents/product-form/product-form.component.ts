import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit, OnDestroy{
  form: FormGroup
  categories$!: Observable<any>
  productId: string = ''
  product: any
  private routeSubscription: Subscription | undefined

  constructor(private categoryService: CategoryService, private productService: ProductService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      title: ['',Validators.required],
      price: [null,[Validators.required,Validators.min(0)]],
      category: ['',Validators.required],
      imageUrl: ['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories()

    // Ascolta i cambiamenti nell'ID del prodotto e aggiorna il form
    this.routeSubscription = this.route.paramMap
      .pipe(
        map(paramMap => paramMap.get('id')), // Ottieni l'ID dal parametro del router
        switchMap(id => {
          this.productId = id ?? '';
          if (this.productId) {
            // Se esiste un ID, carica il prodotto corrispondente
            return this.productService.get(this.productId);
          }
          return []; // Se non c'è ID, restituisci un Observable vuoto
        })
      )
      .subscribe(product => {
        if (product) {
          this.product = product;
          this.form.patchValue({
            title: product.title,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl
          });
        } else {
          // Reset del form se non c'è prodotto
          this.form.reset();
        }
        console.log('Product:', this.product);
      });
  
  }

  save(product:any){
    if(this.productId){
      this.productService.update(this.productId, product).then(() => {
        console.log('Product updated')
        this.router.navigate(['admin/products']).then(success=>{
          if(success){
            console.log("aggiornamento andato a buon fine")
          }else{
            console.log("aggiornamento  non andata a buon fine deammn")
          }
        })
      }).catch((e)=> {
        console.log("Error during updating product", e)
      })
      return
    }else{
      this.productService.create(product).then(() => {
        console.log('Product saved')
        this.router.navigate(['admin/products']).then(success=>{
          if(success){
            console.log("creazione andata a buon fine")
          }else{
            console.log("creazione non andata a buon fine deammn")
          }
        })
      }).catch((e)=>{
        console.log("Error during saving product", e)
      })
    }
    
  }

  delete(){
    if(confirm("Are you sure you want to delete this product?")){
      this.productService.delete(this.productId).then(()=>{
        console.log("product deleted")
        this.router.navigate(['admin/products']).then(success=>{
          if(success){
            console.log("eliminazione andata a buon fine")
          }else{
            console.log("eliminazione non andata a buon fine deammn")
          }
        })
      })
    }
  }

  ngOnDestroy(){
    if(this.routeSubscription){
      this.routeSubscription.unsubscribe()
    }
  }
}
