import { Injectable } from '@angular/core';
import { Database} from '@angular/fire/database';
import { off, onValue, push, ref, set } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dbPath ="/products"

  constructor(private db: Database) {}

  create(product: any): Promise<void> {
    const id = push(ref(this.db, this.dbPath)).key;
    return set(ref(this.db, `${this.dbPath}/${id}`), product);
  }
  
  update(key: string, value: any): Promise<void> {
    return set(ref(this.db, `${this.dbPath}/${key}`), value);
  }

  delete(key: string): Promise<void> {
    return set(ref(this.db, `${this.dbPath}/${key}`), null);
  }

  getAll(): Observable<any[]> {
    return new Observable((observer) => {
      const productsRef = ref(this.db, this.dbPath);

      const callback = onValue(productsRef, (snapshot) => { //onValue listener di firebase, snapshot: stato attuale del nodo
        const productsArray: any[] = [];
        snapshot.forEach((childSnapshot) => {
          productsArray.push({
            key: childSnapshot.key, //aggiungo lo stesso id assegnato da firebase al prodotto
            ...childSnapshot.val(),
          });
        });
        observer.next(productsArray); // Invio dei dati aggiornati
      });

      return () => {
        off(productsRef, 'value', callback); // Rimuove il listener quando non è più necessario
      }
    });
  }

  get(productId: string): Observable<any> {
    return new Observable((observer) => {
      const productRef = ref(this.db, `${this.dbPath}/${productId}`);

      const callback = onValue(productRef, (snapshot) => {
        observer.next({
          key: snapshot.key,
          ...snapshot.val(),
        });
      });
      return () => {
        off(productRef, 'value', callback);
      }
    })
  }
}
