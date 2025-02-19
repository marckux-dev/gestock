import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable, throwError} from 'rxjs';
import {Center} from '../interfaces/center.interface';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CentersService {

  private baseUrl = environment.endPoint;

  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);


  getAll(): Observable<Center[]> {
    return this.http.get<Center[]>(`${this.baseUrl}/centers`, { headers: this.authService.getHeaders() })
      .pipe( catchError(this.handleError) )
    ;
  }

  getByName(name: string): Observable<Center> {
    return this.http.get<Center>(`${this.baseUrl}/centers/${name}`, { headers: this.authService.getHeaders() })
      .pipe( catchError(this.handleError) )
    ;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error ocurred: ', error.error.message);
    } else {
      // Server-side error
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError( () => 'Something bad happened; please try again later.');
  }
}
