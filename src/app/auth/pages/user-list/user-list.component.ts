import {MaterialModule} from '../../../material/material/material.module';
import {User} from '../../interfaces/user';
import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PasswordModalComponent} from '../../components/password-modal/password-modal.component';
import {ConfirmationService} from '../../../shared/services/confirmation.service';
import {EMPTY, switchMap} from 'rxjs';
import {NgIf} from '@angular/common';

@Component({
  selector: 'auth-user-list',
  imports: [MaterialModule, NgIf],
  templateUrl: './user-list.component.html',
  standalone: true,
  styles: [``]
})
export class UserListComponent implements OnInit {

  private authService        : AuthService         = inject(AuthService);
  private dialog             : MatDialog           = inject(MatDialog);
  private snackBar           : MatSnackBar         = inject(MatSnackBar);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  users: User[] = [];
  displayedColumns: string[] = ['full_name', 'role', 'actions'];


  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar los usuarios', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onResetPassword(user: User): void {
    this.confirmationService.confirm(
      'Confirmar reinicio de contraseña',
      '¿Está seguro de reiniciar la contraseña de este usuario?'
    ).pipe(
      switchMap(result => result? this.authService.resetPassword(user.id) : EMPTY)
    ).subscribe({
      next: response => this.dialog.open(PasswordModalComponent, {data: {password: response.password}}),
      error: error => {
        console.error(error);
        this.snackBar.open('Error al resetear la contraseña', 'Cerrar', {duration: 5000});
      },
    });
  }

  onUpgradeUser(user: User): void {
    this.confirmationService.confirm(
      `Confirmar hacer administrador`,
      `¿Está seguro de hacer administrador al usuario ${user.full_name}`
    ).pipe (
      switchMap(result => result? this.authService.upgrade(user.id) : EMPTY)
    ).subscribe ({
      next: response => this.snackBar.open('Usuario ascendido a Administrador', 'OK', {duration: 5000}),
      error: error => {
        console.error(error);
        this.snackBar.open('Error al ascender al usuario', 'Cerrar', {duration: 5000});
      }
    })
  }


  onDeleteUser(user: User): void {
    this.confirmationService.confirm(
      'Confirmar eliminación',
      '¿Está seguro de eliminar este usuario?'
    ).pipe(
      switchMap(result => result ? this.authService.deleteUser(user.id) : EMPTY)
    ).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado', 'OK', { duration: 3000 });
        this.loadUsers();
      },
      error: error => {
        console.error(error);
        this.snackBar.open('Error al eliminar el usuario', 'Cerrar', { duration: 5000 });
      }
    });
  }
}
