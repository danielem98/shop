import { Injectable } from '@angular/core';
import { Database, push, ref, set } from '@angular/fire/database';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: Database, private shoppingCartService : ShoppingCartService) { }

  async storeOrder(order: any): Promise<string>{
    const orderRef = push(ref(this.db, 'orders/'))
    return set(orderRef, order).then(() => {
      this.shoppingCartService.clearCart()
      return orderRef.key as string
    })
  }
}
