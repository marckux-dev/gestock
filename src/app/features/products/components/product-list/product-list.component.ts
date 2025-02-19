import {
  Component,
  computed, inject, OnInit, signal, Signal,
} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {NgForOf, UpperCasePipe} from '@angular/common';
import {MaterialModule} from '../../../../material/material/material.module';
import {ExpansionPanelComponent} from '../../../../shared/components/expansion-panel/expansion-panel.component';
import {ScreenSizeService} from '../../../../shared/services/screen-size.service';
import {RouterLink} from '@angular/router';
import {SortStringsPipe} from '../../../../shared/pipes/sort-strings.pipe';
import {UserPreferencesService} from '../../../../shared/services/user-preferences.service';
import {CategorizedProducts} from '../../helpers/product.helper';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {normalizeString} from '../../../../shared/helpers/strings.helpers';
import {debounceTime, distinctUntilChanged, startWith} from 'rxjs';

@Component({
  selector: 'products-product-list',
  imports: [
    MaterialModule,
    ExpansionPanelComponent,
    NgForOf,
    UpperCasePipe,
    RouterLink,
    SortStringsPipe,
    ReactiveFormsModule
  ],
  templateUrl: './product-list.component.html',
  standalone: true,
  styles: ``
})
export class ProductListComponent implements OnInit {

  // Dependency Injection
  screenSizeService      = inject(ScreenSizeService);
  userPreferencesService = inject(UserPreferencesService);
  productsService        = inject(ProductsService);

  searchControl = new FormControl('');

  // Signals
  isDesktop           : Signal<boolean>             = this.screenSizeService.isDesktop;
  productsByCategory  : Signal<CategorizedProducts> = this.productsService.productsByCategory;
  expandedCategories  : Signal<string[]>            = this.userPreferencesService.expandedCategories;
  displayedColumns    : Signal<string[]>            = computed(() => (
    this.isDesktop()?
        ['name',  'short_name', 'actions']
      : [         'short_name', 'actions']
  ));
  private _searchQuery = signal<string>('');
  filteredProductsByCategory: Signal<CategorizedProducts> = computed(()=> {
    const query = normalizeString(this._searchQuery());
    const original = this.productsByCategory();
    if (!query) return original;
    const filtered: CategorizedProducts = {};
    for (const category in original) {
      const filteredCategory = original[category].filter(product => (
        product.search_vector!.includes(query)
      ));
      if (filteredCategory.length > 0)
        filtered[category] = filteredCategory;
    }
    return filtered;
  });
  categories: Signal<string[]> = computed(() => Object.keys(this.filteredProductsByCategory()));
  searching : Signal<boolean>  = computed(() => this._searchQuery() !== '');


  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(val => this._searchQuery.set(val || ''));
    this.productsService.fetchProducts();
  }

  toggleCategory(category:string, $event: boolean): void {
    if ($event) {
      this.userPreferencesService.addExpandedCategory(category);
    } else {
      this.userPreferencesService.removedExpandedCategory(category);
    }
  }

}
