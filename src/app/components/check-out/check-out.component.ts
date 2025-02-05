import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ShoppingCartSummaryComponent } from "../shopping-cart-summary/shopping-cart-summary.component";
import { ShoppingCart } from '../../models/shopping-cart';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ShoppingCartSummaryComponent],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent implements OnInit, OnDestroy{
  form: FormGroup
  cart!: ShoppingCart
  userId: String | undefined
  cartSubscription: Subscription = new Subscription
  userSubscription: Subscription = new Subscription

  constructor(
    private fb: FormBuilder,
    private shoppingCartService: 
    ShoppingCartService, 
    private orderService: OrderService, 
    private authService : AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name:['', Validators.required],
      surname:['', Validators.required],
      address:['', Validators.required],
      addressNumber:['', [Validators.required, Validators.max(999), Validators.min(1)]],
      city:['', Validators.required],
      cap:['', [Validators.required, Validators.max(99999), Validators.min(9999)]],
      }
    )
  }

   ngOnInit(): void {
    this.cartSubscription = this.shoppingCartService.getCart().subscribe(cart => this.cart = cart)
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user?.uid)
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe()
    this.userSubscription.unsubscribe()
  }

  async placeOrder(){
    let order = {
      userId: this.userId,
      datePlaced: new Date().getTime(),
      shipping: this.form.value,
      items: Object.values(this.cart.items).map((i: any) => {
        return {
          product: {
            key: i.key,
            title: i.title,
            imageUrl: i.imageUrl,
            price: i.price
          },
          quantity: i.quantity,
          totalPrice: i.price * i.quantity
        }
      })
    }
    let orderKey = await this.orderService.storeOrder(order)
    this.router.navigate(['/order-success', orderKey])
  }
}