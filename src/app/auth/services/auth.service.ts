import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {LoginResponse} from '../interfaces/login.response';
import {User} from '../interfaces/user';
import {jwtDecode} from 'jwt-decode';
import {RegisterResponse} from '../interfaces/register.response';
import {Role} from '../interfaces/role.enumeration';
import {hasIntersection} from '../../shared/helpers/arrays.helpers';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.endPoint;

  // Dependency injection
  private http: HttpClient = inject(HttpClient);

  // Signals
  private _user : WritableSignal<User | null>   = signal<User | null>(null);
  private _token: WritableSignal<string | null> = signal<string | null>(null);
  isLogged      : Signal<boolean>               = computed(() => !!this._user());
  isAdmin       : Signal<boolean>               = computed(() => !!this.user()
                                                    && hasIntersection(this.user()!.roles, [Role.ADMIN, Role.SUPER]));


  get user(): Signal<User | null> {
    return this._user.asReadonly();
  }

  getToken(): string | null {
    return this._token()?? localStorage.getItem('stock-manager-token');
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  login(full_name: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>( `${this.baseUrl}/auth/login`, {full_name, password})
      .pipe(tap ( response => {
          this._user.set(response.user);
          this._token.set(response.token);
          localStorage.setItem('stock-manager-token', this._token()!);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('stock-manager-token');
  }

  register(full_name: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>( `${this.baseUrl}/auth/register`, { full_name }, { headers: this.getHeaders() });
  }

  resetPassword(id: string): Observable<RegisterResponse> {
    return this.http.patch<RegisterResponse>(`${this.baseUrl}/auth/reset-password/${id}`, {}, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/auth/users/${id}`, { headers: this.getHeaders() }).pipe(tap(console.log));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/auth/users`, { headers: this.getHeaders() });
  }

  upgrade(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/auth/upgrade/${id}`, {},  { headers: this.getHeaders() })
  }

  restoreSession(): Promise<void> {
    return new Promise(
      resolve => {
        const token = this.getToken();
        if (!token) {
          resolve();
          return;
        }
        const { id } = jwtDecode<{ id:string }>(token);
        this.http.get<User>( `${this.baseUrl}/auth/users/${id}`, { headers: this.getHeaders() })
          .subscribe({
            next: user => {
              this._user.set(user);
              this._token.set(token);
              resolve();
            },
            error: error => {
              console.log('Sesion restoration failed', error);
              this.logout();
              resolve();
            }
          });
      }
    )
  }
}
