import { Injectable } from '@angular/core';
import { Database, push, ref, set, query, list, listVal, orderByChild, equalTo, get } from '@angular/fire/database';
import { ShoppingCartService } from './shopping-cart.service';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: Database, private shoppingCartService : ShoppingCartService, private authService: AuthService) { }

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

  
  getTotalPrice(items: any[]): number {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  }

  getOrdersByUser(userId: string): Observable<any[]> {
    const orderRef = query(ref(this.db, 'orders'), orderByChild('userId'), equalTo(userId));

    return from(get(orderRef)).pipe(
      map(snapshot => snapshot.exists() ? Object.values(snapshot.val()) : [])
    );
  }

  getOrdersByCurrentUser(): Observable<any[]> {
    return from(this.authService.getCurrentUserId()).pipe(
      switchMap(userId => {
        if (!userId) return from([]); // Se non c'è userId, ritorna un array vuoto

        const orderRef = query(ref(this.db, 'orders'), orderByChild('userId'), equalTo(userId));
        return from(get(orderRef)).pipe(
          map(snapshot => (snapshot.exists() ? Object.values(snapshot.val()) : []))
        );
      })
    );
  }
}

