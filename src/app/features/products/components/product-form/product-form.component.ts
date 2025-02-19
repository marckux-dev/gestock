import {Component, computed, inject, OnInit, signal, Signal} from '@angular/core';
import {MaterialModule} from '../../../../material/material/material.module';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProductsService} from '../../services/products.service';
import {Product} from '../../interfaces/product.interface';
import {NgForOf, NgIf} from '@angular/common';
import {ConfirmationService} from '../../../../shared/services/confirmation.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {of, switchMap} from 'rxjs';
import {ProductDtoInterface} from '../../interfaces/product.dto.interface';
import {AuthService} from '../../../../auth/services/auth.service';

@Component({
  selector: 'products-product-form',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterLink,
    NgForOf,
    NgIf,
  ],
  templateUrl: './product-form.component.html',
  standalone: true,
  styles: ``
})
export class ProductFormComponent implements OnInit {

  // Dependency Injection
  route                 : ActivatedRoute      = inject(ActivatedRoute);
  router                : Router              = inject(Router);
  fb                    : FormBuilder         = inject(FormBuilder);
  productsService       : ProductsService     = inject(ProductsService);
  confirmationService   : ConfirmationService = inject(ConfirmationService);
  snackBar              : MatSnackBar         = inject(MatSnackBar);
  authService           : AuthService         = inject(AuthService);

  // Signals
  productId   : Signal<string | null> = signal(this.route.snapshot.paramMap.get('id'));
  isEditing   : Signal<boolean>       = computed((): boolean => !!this.productId());
  categories  : Signal<string[]>      = this.productsService.categories;
  isAdmin     : Signal<boolean>       = this.authService.isAdmin;

  // Form
  productForm = this.fb.group({
    name:             ['', [Validators.required]],
    short_name:       ['', [Validators.required]],
    category:         ['', [Validators.required]],
    active_principle: [''],
    synonyms:         [''],
  });

  ngOnInit(): void {
    if (this.isEditing())
      this.productsService.getOneById(this.productId()!)
        .subscribe((product) => { this.productForm.patchValue(product) });
  }

  saveProduct() {
    if (this.productForm.invalid) return;
    if (this.isEditing()) {
      this.updateProduct(this.productId()!, this.productForm.value);
    } else {
      this.createProduct(this.productForm.value);
    }
  }

  private createProduct(product: ProductDtoInterface) {
    if (!this.isAdmin) return;
    this.productsService.create(product)
      .subscribe({
        next: product => {
          this.snackBar.open(
            `Se ha creado ${product.short_name}`, 'OK', {duration: 3000}
          );
          this.router.navigate(['/dashboard', 'products']);
        },
        error: error => this.handleError(error),
      });
  }

  private updateProduct(id: string, product: ProductDtoInterface) {
    this.productsService.update(id, product)
      .subscribe(
        {
          next: product => {
            this.snackBar.open(
              `Se ha actualizado ${product.short_name}`, 'OK', { duration: 3000 }
            );
            this.router.navigate(['/dashboard', 'products'])
          },
          error: error => this.handleError(error),
        }
      );
  }

  deleteProduct(): void {
    if (!this.isAdmin) return;
    if (!this.isEditing())
      return;
    this.confirmationService.confirm(`Se dispone a eliminar el producto`, '¿Está seguro?')
      .pipe(
        switchMap(
            (result: boolean) => result?
            this.productsService.delete(this.productId()!)
            : of(null)
        ),
      ).subscribe({
        next: (result: Product | null) =>{
          if (result) {
            const [short_name, end] = result.short_name.split(' d:');
            this.snackBar.open(`${short_name} eliminado`, 'OK', { duration: 3000 });
            this.router.navigate(['/dashboard', 'products']);
          }
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error del servidor!', 'CERRAR', { duration: 5000 });
        }
    });
  }

  private handleError(error: any) {
    const { field } = error.error;
    if (field) {
      this.invalidateField(error.error.field, 'duplicated');
      this.snackBar.open(
        error.error.message, 'CERRAR', { duration: 5000 }
      );
    } else {
      this.snackBar.open(
        'Error del servidor!', 'CERRAR', { duration: 5000 }
      );
    }
  }

  private invalidateField(field: string, error: string) {
    const control = this.productForm.get(field);
    control?.setErrors({ [error]: true });
  }

}
