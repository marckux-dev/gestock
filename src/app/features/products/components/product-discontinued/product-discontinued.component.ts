import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MaterialModule} from '../../../../material/material/material.module';
import {ScreenSizeService} from '../../../../shared/services/screen-size.service';
import {UserPreferencesService} from '../../../../shared/services/user-preferences.service';
import {ProductsService} from '../../services/products.service';
import {CategorizedProducts} from '../../helpers/product.helper';
import {ExpansionPanelComponent} from '../../../../shared/components/expansion-panel/expansion-panel.component';
import {NgForOf, UpperCasePipe} from '@angular/common';
import {SortStringsPipe} from '../../../../shared/pipes/sort-strings.pipe';
import {CleanTailPipe} from '../../pipes/clean-tail.pipe';
import {GetDatePipe} from '../../pipes/get-date.pipe';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'products-product-discontinued',
  imports: [MaterialModule, ExpansionPanelComponent, NgForOf, SortStringsPipe, UpperCasePipe, CleanTailPipe, GetDatePipe],
  templateUrl: './product-discontinued.component.html',
  standalone: true,
  styles: ``
})
export class ProductDiscontinuedComponent implements OnInit {
  // Dependency Injection
  screenSizeService       : ScreenSizeService       = inject(ScreenSizeService);
  userPreferencesService  : UserPreferencesService  = inject(UserPreferencesService);
  productsService         : ProductsService         = inject(ProductsService);
  snackBar                : MatSnackBar             = inject(MatSnackBar);

  // Signals
  isDesktop           : Signal<boolean>             = this.screenSizeService.isDesktop;
  discontinuedByCat   : Signal<CategorizedProducts> = this.productsService.discontinuedByCategory;
  categories          : Signal<string[]>            = this.productsService.discontinuedCategories;
  expandedCategories  : Signal<string[]>            = this.userPreferencesService.expandedCategories;
  displayedColumns    : Signal<string[]>            = computed(() => (
    this.isDesktop()?
        ['name',        'date', 'actions']
      : ['short_name',  'date', 'actions']
  ));

  ngOnInit(): void {
    this.productsService.fetchProducts();
  }

  toggleCategory(category:string, $event: boolean): void {
    if ($event) {
      this.userPreferencesService.addExpandedCategory(category);
    } else {
      this.userPreferencesService.removedExpandedCategory(category);
    }
  }

  restore(id: string) {
    this.productsService.restore(id)
      .subscribe({
        next: () => this.snackBar.open(`Product restored`, 'OK', { duration: 3000}),
        error: (error) => {
          console.error(error);
          this.snackBar.open(`Error en la recuperación`, 'CERRAR', { duration: 5000 })
        }
      });
  }
}
