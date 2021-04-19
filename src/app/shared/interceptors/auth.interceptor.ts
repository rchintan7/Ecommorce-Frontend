import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { NgxSpinnerService  } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { InterceptorSkipHeader } from 'src/app/shared/models/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  // tslint:disable-next-line: typedef
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (!request.headers.has(InterceptorSkipHeader)) {
      this.spinner.show();
    }
    const authToken = this.authService.getToken();
    let setHeaders = {Accept : 'application/json'};
    if (authToken) {
      setHeaders = {...setHeaders, ...{Authorization: `Bearer ${authToken}`} };
    }
    return next.handle(request.clone({setHeaders})).pipe(
      catchError((error: any) => {
          if (error instanceof HttpErrorResponse) {
              if (error.status === 0) {
                this.authService.errorMessage('Neteisingas Prašymas');
              }
              else if (error.status === 401) {
                this.authService.errorMessage('Neteisėtas vartotojas');
                this.authService.logout();
                this.router.navigate(['']);
              }
              else if (error.status === 500) {
                this.authService.errorMessage('Klaida, bandykite dar kartą.');
              }
          }
          return of(error);
      }),
      finalize(() => {
        this.spinner.hide();
      }),
    );
  }

}
