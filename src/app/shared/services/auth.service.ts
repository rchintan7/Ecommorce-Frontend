import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  endPoint: string = environment.API_URL;
  contactFormSubscription = new Subject<number>();
  constructor(private toastrService: ToastrService, private http: HttpClient) {}

  getUserId(): number {
    return localStorage.getItem('id') != null
      ? Number(localStorage.getItem('id'))
      : 0;
  }

  setUserId(id): void {
    localStorage.setItem('id', id);
  }

  getUserName(): string {
    return localStorage.getItem('username') != null
      ? localStorage.getItem('username')
      : '';
  }

  setUserName(username): void {
    localStorage.setItem('username', username);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('id') != null ? true : false;
  }

  setToken(token): void {
    localStorage.setItem('token', token);
  }
  getToken(): string {
    return localStorage.getItem('token');
  }
  saveAuthData(data): void {
    localStorage.setItem('id', data.id);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.name);
    localStorage.setItem('userProfile', data);
  }
  logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userProfile');
  }
  sucessMessage(message: string): void {
    this.toastrService.success(message, 'Pavyko!');
  }
  errorMessage(message: string): void {
    this.toastrService.error(message, 'Klaida!');
  }

  loginUser(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/login', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  saveUser(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/register', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  updateProfile(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/update_profile', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
