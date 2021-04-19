import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';

@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PaymentResponseComponent implements OnInit {
  message = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private commonApisService: CommonApisService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      (params: { answer: string; data: string; ss1: string; ss2: string }) => {
        if (params.answer === 'accept') {
         this.commonApisService
            .paymentSuccess(params.data, params.ss1, params.ss2)
            .subscribe(
              (response) => {
                this.message = response.message;
                setTimeout(() => {
                  this.cartService.clearCart();
                  if (this.authService.isLoggedIn()) {
                    this.commonApisService.redirectToOrderList();
                  } else {
                    this.router.navigateByUrl('/');
                  }
                }, 3000);
              },
              (error) => {
                console.log('Payment Api Error', error);
              }
            );
        } else if (params.answer === 'cancel') {
          this.message = 'Nepavyko sumokėti';
        } else {
          this.message = 'Mokėjimas atmestas';
        }
      }
    );
  }
}
