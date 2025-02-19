import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Product} from '../interfaces/product.interface';
import {Observable, tap} from 'rxjs';
import {CategorizedProducts} from '../helpers/product.helper';
import {ProductDtoInterface} from '../interfaces/product.dto.interface';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = environment.endPoint;

  // Dependency Injection
  private http       : HttpClient  = inject(HttpClient);
  private authService: AuthService = inject(AuthService);

  // Signals
  private _productsByCategory    : WritableSignal<CategorizedProducts> = signal<CategorizedProducts>({});
  private _discontinuedByCategory: WritableSignal<CategorizedProducts> = signal<CategorizedProducts>({});
  categories                     : Signal<string[]>                    = computed(() => Object.keys(this.productsByCategory()));
  discontinuedCategories         : Signal<string[]>                    = computed(() => Object.keys(this.discontinuedByCategory()));

  // Getters
  get productsByCategory(): Signal<CategorizedProducts> {
    return this._productsByCategory.asReadonly();
  }

  get discontinuedByCategory(): Signal<CategorizedProducts> {
    return this._discontinuedByCategory.asReadonly();
  }

  fetchProducts():void {
    this.http.get<CategorizedProducts>(`${this.baseUrl}/products/by-category`, { headers: this.authService.getHeaders() })
      .subscribe(categorizedProducts => this._productsByCategory.set(categorizedProducts));
    this.http.get<CategorizedProducts>(`${this.baseUrl}/products/discontinued/by-category`, { headers: this.authService.getHeaders() })
      .subscribe(categorizedProducts => this._discontinuedByCategory.set(categorizedProducts));
  }

  create(product: ProductDtoInterface): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product, { headers: this.authService.getHeaders() })
      .pipe(
        tap( () =>{ this.fetchProducts() })
      );
  }

  update(id: string, product: ProductDtoInterface): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/products/${id}`, product, { headers: this.authService.getHeaders() })
      .pipe(
        tap( () => { this.fetchProducts() })
      );

  }

  delete(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/products/${id}`, { headers: this.authService.getHeaders() })
      .pipe(
        tap( () => { this.fetchProducts() })
      );
  }

  restore(id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/products/${id}/restore`, {}, { headers: this.authService.getHeaders() })
      .pipe(
        tap( () => { this.fetchProducts() })
      );
  }

  getOneById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`, { headers: this.authService.getHeaders() })
      .pipe(tap( () => { this.fetchProducts() } ));
  }
}
