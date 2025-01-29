import { Injectable } from '@angular/core';
import { child, get, getDatabase, ref } from 'firebase/database';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  getCategories(): Observable<any>{
    const dbRef = ref(getDatabase())
    const categoriesRef = child(dbRef,'categories')

    return from(get(categoriesRef)).pipe(
      map(snapshot => {
        if(snapshot.exists()){
          return Object.values(snapshot.val()) as any[]
        }else{
          throw new Error('No data available')
        }
        })
    )

  }
}
