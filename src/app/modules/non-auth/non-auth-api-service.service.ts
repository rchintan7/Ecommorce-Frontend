import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NonAuthApiServiceService {
  endPoint: string = environment.API_URL;
  constructor(private toastrService: ToastrService, private http: HttpClient) { }

  loginUser(args: any): Observable<any> {
    return this.http.post(this.endPoint + 'api/login', args);
  }

  saveUser(args: any): Observable<any> {
    return this.http.post(this.endPoint + 'api/register', args);
  }

  verifyToken(args: any): Observable<any> {
    return this.http.post(this.endPoint + 'api/verifytoken', args);
  }

  forgotPassword(args: any): Observable<any> {
    return this.http.post(this.endPoint + 'api/forgot_password', args);
  }

  verifyOtp(args: any): Observable<any> {
    return this.http.post(this.endPoint + 'api/verify_otp', args);
  }

  resetPassword(args: any): Observable<any> {
    return this.http.post(this.endPoint + 'api/reset_password', args);
  }

  resendOtp(args: any): Observable<any> {
    return this.http.post(this.endPoint + 'api/resend_otp', args);
  }

  sucessMessage(message: string): void {
    this.toastrService.success(message, 'Pavyko!');
  }
  errorMessage(message: string): void {
    this.toastrService.error(message, 'Klaida!');
  }
}
