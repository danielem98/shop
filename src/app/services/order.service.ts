import { Injectable } from '@angular/core';
import { Database, push, ref, set, query, list, listVal } from '@angular/fire/database';
import { ShoppingCartService } from './shopping-cart.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: Database, private shoppingCartService : ShoppingCartService) { }

  async storeOrder(order: any): Promise<string>{
    const orderRef = push(ref(this.db, 'orders/'))
    const orderId = orderRef.key as string
    const orderWithId = { ...order, orderId }
    return set(orderRef, orderWithId).then(() => {
      this.shoppingCartService.clearCart()
      return orderRef.key as string
    })
  }

 
  getOrders(): Observable<any[]> {
    const orderRef = ref(this.db, 'orders');
    return listVal(orderRef); // Restituisce un Observable con la lista degli ordini
  }
  
}

