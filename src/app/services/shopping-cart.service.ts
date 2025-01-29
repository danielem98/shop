import { Injectable } from '@angular/core';
import { Database, get, onValue, push, ref, set } from '@angular/fire/database';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ items: {} });

  constructor(private db: Database) {
    this.initializeCart();
  }

  private async initializeCart(): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    const cartRef = ref(this.db, '/shopping-carts/' + cartId);

    // Sincronizza i dati del carrello in tempo reale
    onValue(cartRef, snapshot => {
      if (snapshot.exists()) {
        this.cartSubject.next(snapshot.val());
      } else {
        this.cartSubject.next({ items: {} }); // Carrello vuoto
      }
    });
  }
  
  updateCartSubject() {
    throw new Error('Method not implemented.');
  }

  getCart(): Observable<any> {
    return this.cartSubject.asObservable(); // Restituisce un Observable del carrello
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    const resultId = await this.create();
    localStorage.setItem('cartId', resultId);
    return resultId;
  }

  private create(): Promise<string> {
    const shoppingCartRef = ref(this.db, '/shopping-carts');
    const newCartRef = push(shoppingCartRef);

    return set(newCartRef, {
      dateCreated: new Date().getTime()
    }).then(() => newCartRef.key ?? '');
  }

  async addToCart(product: Product): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    const itemRef = ref(this.db, `/shopping-carts/${cartId}/items/${product.key}`);

    const itemSnapshot = await get(itemRef);

    if (itemSnapshot.exists()) {
      const currentQuantity = itemSnapshot.val().quantity || 0;
      await set(itemRef, {
        ...product,
        quantity: currentQuantity + 1
      });
    } else {
      await set(itemRef, {
        ...product,
        quantity: 1
      });
    }
  }

  async removeFromCart(product: Product): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    const itemRef = ref(this.db, `/shopping-carts/${cartId}/items/${product.key}`);

    const itemSnapshot = await get(itemRef);

    if (itemSnapshot.exists()) {
      const currentQuantity = itemSnapshot.val().quantity || 0;
      if (currentQuantity == 1) {
        await set(itemRef, null);
      } else {
        await set(itemRef, {
          ...product,
          quantity: currentQuantity - 1
        });
      }
    }
  }

  async clearCart(): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    const cartRef = ref(this.db, `/shopping-carts/${cartId}`);
    await set(cartRef, null);
  }
}
