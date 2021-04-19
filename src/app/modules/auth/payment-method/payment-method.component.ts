import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PaymentMethodComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
