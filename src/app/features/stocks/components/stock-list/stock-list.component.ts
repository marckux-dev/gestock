import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MaterialModule} from '../../../../material/material/material.module';
import {Stock} from '../../interfaces/stock.interface';
import {StocksService} from '../../services/stocks.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  startWith,
  Subscription,
  throwError
} from 'rxjs';
import {Center} from '../../../centers/interfaces/center.interface';
import {ExpansionPanelComponent} from '../../../../shared/components/expansion-panel/expansion-panel.component';
import {SortStringsPipe} from '../../../../shared/pipes/sort-strings.pipe';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CleanTailPipe} from '../../../products/pipes/clean-tail.pipe';
import {UserPreferencesService} from '../../../../shared/services/user-preferences.service';
import {CategorizedStocks} from '../../helpers/stock.helper';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {normalizeString} from '../../../../shared/helpers/strings.helpers';
import {MatDialog} from '@angular/material/dialog';
import {QrScannerComponent} from '../../../../shared/components/qr-scanner/qr-scanner.component';

enum Column {
  NAME= 'short_name',
  MAX = 'maximum_storage',
  CURR = 'current_storage'
}

interface Editable {
  oldValue?: Stock & Editable;
  editing?: Column | null;
}

@Component({
  selector: 'stocks-stock-list',
  imports: [MaterialModule, ExpansionPanelComponent, UpperCasePipe, NgForOf, SortStringsPipe, NgIf, FormsModule, CleanTailPipe, ReactiveFormsModule],
  templateUrl: './stock-list.component.html',
  standalone: true,
  styles: ``,
})
export class StockListComponent implements OnInit, OnDestroy {

  protected readonly Column = Column;

  // Dependency Injection
  userPreferences : UserPreferencesService  = inject(UserPreferencesService)
  stocksService   : StocksService           = inject(StocksService);
  route           : ActivatedRoute          = inject(ActivatedRoute);
  router          : Router                  = inject(Router);
  dialog          : MatDialog               = inject(MatDialog);

  searchControl = new FormControl('');

  // Signals
  center            : Signal<Center | null>     = this.stocksService.center;
  stocksByCategory  : Signal<CategorizedStocks> = this.stocksService.stocksByCategory;
  expandedCategories: Signal<string[]>          = this.userPreferences.expandedCategories;
  displayedColumns: string[] = ['short_name', 'maximum_storage', 'current_storage'];

  private _searchQuery: WritableSignal<string> = signal<string>('');

  filteredStocksByCategory: Signal<CategorizedStocks> = computed(() => {
    const query = normalizeString(this._searchQuery()).trim();
    const original = this.stocksByCategory();
    if (!query) return original;
    const filtered: CategorizedStocks = {}
    for (const category in original) {
      const byId = original[category].filter(stock => stock.id === query);
      if (byId.length>0) {
        filtered[category] = byId;
        return filtered;
      }
      const filteredCategory = original[category].filter(stock => (
        stock.product.search_vector!.includes(query)
      ));
      if (filteredCategory.length > 0)
        filtered[category] = filteredCategory;
    }
    return filtered;
  });

  categories  : Signal<string[]>  = computed(() => Object.keys(this.filteredStocksByCategory()));
  searching   : Signal<boolean>   = computed(() => this._searchQuery() !== '');

  private routeSubscription?: Subscription;

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(
      params => {
        this.stocksService.setCenter(params.get('name'));
      }
    );
    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(val => this._searchQuery.set(val || ''));
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  toggleCategory(category: string, $event: boolean): void {
    if ($event) {
      this.userPreferences.addExpandedCategory(category);
    } else {
      this.userPreferences.removedExpandedCategory(category);
    }
  }

  edit(stock: Stock & Editable, field: Column.MAX|Column.CURR, $event: Event): void {
    const spanE = $event.target as HTMLSpanElement;
    const parentE = spanE.parentElement;
    stock.editing = field;
    stock.oldValue = {...stock};
    setTimeout(() => {
      const inputE = parentE!.querySelector('input') as HTMLInputElement;
      if (inputE) inputE.focus();
    }, 100);
  }

  save(stock: Stock & Editable): void {
    const {editing, oldValue, ...stockToUpdate} = stock;
    if (
      stock.current_storage !== oldValue!.current_storage
      || stock.maximum_storage !== oldValue!.maximum_storage
    ){
      this.stocksService.update(stockToUpdate)
        .pipe(
          catchError(err => {
            stock.maximum_storage = oldValue!.maximum_storage;
            stock.current_storage = oldValue!.current_storage;
            return throwError(()=>err);
          })
        )
    }
    stock.oldValue = undefined;
    stock.editing = null;
  }

  drop($event: CdkDragDrop<Stock[]>) {
    if (this.searching()) return;
    const previousCategory = $event.previousContainer.id;
    const currentCategory = $event.container.id;
    const stock: Stock = $event.item.data;
    const index: number = $event.currentIndex;
    if (stock)
      if (previousCategory === currentCategory) {
        this.stocksService.move(stock, index).subscribe(() => {});
      } else {
        this.stocksService.move(stock, index, currentCategory).subscribe(() => {});
      }
  }

  openQrScanner(): void {
    const dialogRef = this.dialog.open(QrScannerComponent, { width: '400px'});
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.searchControl.setValue(result);
    });
  }
}
