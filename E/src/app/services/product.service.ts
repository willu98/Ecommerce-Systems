import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Product, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getCatalog() {
    return this.http.get<Category[]>(`/api/Catalog`); // From Project C
  }

  getCategoryById(id: number): Observable<Category> {
    return new Observable<Category>((subscriber) => {
      // Use getCatalog instead of direct API call to avoid differences
      // in implementation and requirements between Project C and E.
      this.getCatalog().subscribe((categories) => {
        const category = categories.find(c => c.id === id);
        if (category) {
          subscriber.next(category);
        } else {
          subscriber.error({ status: 404, statusText: 'NOT FOUND' });
        }
        subscriber.complete();
      });
    });
  }

  getProductById(id: string) {
    return this.http.get<Product>(`/api/products/?id=${id}`);
  }

  getProductsByCategory(catId: number) {
    return this.http.get<Product[]>(`/api/products/category/?id=${catId}`);
  }

  getProducts() {
    return this.http.get<Product[]>(`/api/search`);
  }
}