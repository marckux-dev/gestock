import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Stock} from '../interfaces/stock.interface';
import {Observable, tap} from 'rxjs';
import {Center} from '../../centers/interfaces/center.interface';
import {CentersService} from '../../centers/services/centers.service';
import {CategorizedStocks} from '../helpers/stock.helper';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  private baseUrl = environment.endPoint;

  // Dependency injection
  private http            : HttpClient      = inject(HttpClient);
  private centersService  : CentersService  = inject(CentersService);
  private authService     : AuthService     = inject(AuthService);

  // Signals
  private _center          : WritableSignal<Center | null>     = signal<Center | null>(null);
  private _stocksByCategory: WritableSignal<CategorizedStocks> = signal<CategorizedStocks>({});

  get center(): Signal<Center | null> {
    return this._center.asReadonly();
  }

  get stocksByCategory(): Signal<CategorizedStocks> {
    return this._stocksByCategory;
  }

  setCenter(name: string | null) {
    if (!name) return;
    this.centersService.getByName(name).subscribe(center => {
      this._center.set(center);
      this.fetchStocks();
    });
  }

  fetchStocks(): void {
    const centerName = this._center()?.name;
    if (!centerName) return;
    this.http.get<CategorizedStocks>(`${this.baseUrl}/stocks/center/${centerName}/by-category`, { headers: this.authService.getHeaders() })
      .subscribe(stocksByCategory => this._stocksByCategory.set(stocksByCategory));
  }

  update(stock: Stock): Observable<Stock> {
    const {id, maximum_storage, current_storage} = stock;
    return this.http.patch<Stock>(`${this.baseUrl}/stocks/${id}`, {maximum_storage, current_storage}, { headers: this.authService.getHeaders() })
      .pipe(tap(()=> this.fetchStocks()));
  }

  move(stock: Stock, stock_order: number, stock_category?: string): Observable<Stock> {
    const { id } = stock;
    const payload: any = { stock_order };
    if (stock_category) {
      payload.stock_category = stock_category;
    }
    return this.http.patch<Stock>(`${this.baseUrl}/stocks/${id}/move`, payload, { headers: this.authService.getHeaders() })
      .pipe(tap(()=> this.fetchStocks()));
  }

}
