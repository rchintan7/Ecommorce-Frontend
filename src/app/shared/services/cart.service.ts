import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from 'src/app/shared/models/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CartService {
  private total = 0;
  private items = [];
  endPoint: string = environment.API_URL;
  quantitySubscription = new Subject<number>();
  quantityRemoveSubscription = new Subject<number>();

  constructor(private http: HttpClient) { }




  addToCart(product, quantity): void {
    const item: Item = { product, quantity };
    if (localStorage.getItem('cart') === null) {
      const cart: any = [];
      cart.push(JSON.stringify(item));
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const cart: any = JSON.parse(localStorage.getItem('cart'));
      let index = -1;
      for (let i = 0; i < cart.length; i++) {
        // tslint:disable-next-line: no-shadowed-variable
        const item: Item = JSON.parse(cart[i]);
        if (
          item.product.id === product.id &&
          item.product.warrantyYear === product.warrantyYear &&
          item.product.insuranceYear === product.insuranceYear
        ) {
          let valid = true;
          if (product.option.length && item.product.option.length) {
            product.option.forEach((element, index) => {
              if (!(element.option_id === item.product.option[index].option_id && element.value === item.product.option[index].value
                && element.variation_type === item.product.option[index].variation_type)) {
                valid = false;
              }
            });
          }
          if (valid) {
            index = i;
            break;
          }
        }
      }
      if (index === -1) {
        cart.push(JSON.stringify(item));
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        // tslint:disable-next-line: no-shadowed-variable
        const item: Item = JSON.parse(cart[index]);
        item.quantity += 1;
        cart[index] = JSON.stringify(item);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
    this.quantityChangeSubscription();
  }

  loadCart(): void {
    this.total = 0;
    this.items = [];
    if (localStorage.getItem('cart') != null) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < cart.length; i++) {
        const item = JSON.parse(cart[i]);
        this.items.push({
          product: item.product,
          quantity: item.quantity,
        });
        this.total += item.product.price * item.quantity;
      }
    }
  }

  getCartItem(): any[] {
    return this.items;
  }

  quanityChange(index, quantity): void {
    if (localStorage.getItem('cart') != null) {
      const cart: any = JSON.parse(localStorage.getItem('cart'));
      const item: Item = JSON.parse(cart[index]);
      item.quantity = quantity;
      cart[index] = JSON.stringify(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.quantityChangeSubscription();
    }
  }

  removeItem(index): void {
    if (localStorage.getItem('cart') != null) {
      const cart: any = JSON.parse(localStorage.getItem('cart'));
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.quantityChangeSubscription();
    }
  }

  getQuantityByProductId(productId): number {
    let quantity = 1;
    if (localStorage.getItem('cart') != null) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < cart.length; i++) {
        const item = JSON.parse(cart[i]);
        if (item.product.id === productId) {
          quantity = item.quantity;
        }
      }
    }
    return quantity;
  }

  getTotalProduct(): number {
    let totalQuantity = 0;
    if (localStorage.getItem('cart') != null) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < cart.length; i++) {
        const item: Item = JSON.parse(cart[i]);
        totalQuantity += item.quantity;
      }
    }
    return totalQuantity;
  }

  productCountById(productId): number {
    let totalQuantity = 0;
    if (localStorage.getItem('cart') != null) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < cart.length; i++) {
        const item: Item = JSON.parse(cart[i]);
        if (item.product.id === productId) {
          totalQuantity += item.quantity;
        }
      }
    }
    return totalQuantity;
  }

  quantityChangeSubscription(): void {
    this.quantitySubscription.next(this.getTotalProduct());
  }

  quantityRemove(): void {
    this.quantityRemoveSubscription.next();
  }
  clearCart(): void {
    localStorage.removeItem('cart');
    this.quantitySubscription.next(0);
  }

  decimalNumber(price: number): string {
    return Number(price).toFixed(2);
  }

  placeOrder(formdata: FormData): Observable<any> {
    return this.http.post(this.endPoint + 'api/place_order', formdata);
  }

  checkProductPrice(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/check_product_price', args);
  }
}
