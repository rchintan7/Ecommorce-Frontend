import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InterceptorSkipHeader } from 'src/app/shared/models/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonApisService {
  endPoint: string = environment.API_URL;
  constructor(private http: HttpClient, private router: Router) { }

  fetchCategories(): Observable<any> {
    return this.http.post(this.endPoint + 'api/categories', '', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchLogos(): Observable<any> {
    return this.http.get(this.endPoint + 'api/logo_section', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchBanners(): Observable<any> {
    return this.http.get(this.endPoint + 'api/banner_section', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchSpecialOfferProducts(): Observable<any> {
    return this.http.get(this.endPoint + 'api/offer_product', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchCategorySections(offset): Observable<any> {
    return this.http.get(this.endPoint + 'api/homepage_category_section', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchSubCategoriesById(categorySlug): Observable<any> {
    const args: any = {};
    args.category = categorySlug;
    return this.http.post(this.endPoint + 'api/sub_category_listpage', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchIconList(): Observable<any> {
    return this.http.get(this.endPoint + 'api/icon_list_section', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchBannerList(): Observable<any> {
    return this.http.get(this.endPoint + 'api/main_banner_section', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchProductList(
    categoryId,
    subCategoryId,
    search,
    minPrice,
    maxPrice,
    manufacture,
    deliveryType,
    order,
    orderByColumnName,
    page
  ): Observable<any> {
    const args: any = {};
    args.category_id = categoryId;
    args.sub_category_id = subCategoryId;
    args.search = search;
    args.min_price = minPrice;
    args.max_price = maxPrice;
    args.order = order;
    args.deliveryType = deliveryType;
    args.manufacture = manufacture;
    args.orderByColumnName = orderByColumnName;
    args.page = page;
    return this.http.post(this.endPoint + 'api/product_list_page', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchProductListTest(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/product_list_page', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchProductDetails(productSlug: string): Observable<any> {
    const args: any = { product_slug: productSlug };
    return this.http.post(this.endPoint + 'api/product_detail_page', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchManufactureDeliveryTypeList(): Observable<any> {
    return this.http.get(this.endPoint + 'api/manufacture_deliverytype_list', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchProdoctWishlist(page): Observable<any> {
    return this.http.get(this.endPoint + 'api/product_wishlist?page=' + page, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fecthOrderList(page, search, sortBy): Observable<any> {
    const args: any = { page, search, sort_by: sortBy };
    return this.http.post(this.endPoint + 'api/order_list', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchCategorySettings(): Observable<any> {
    return this.http.get(this.endPoint + 'api/category_setting', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  addToWishlist(isWishlistAdded, productId): Observable<any> {
    const args: any = {
      is_wishlist_added: isWishlistAdded,
      product_id: productId,
    };
    return this.http.post(this.endPoint + 'api/add_to_wishlist', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  fetchProfile(): Observable<any> {
    return this.http.get(this.endPoint + 'api/profile', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  home(): Observable<any> {
    return this.http.get(this.endPoint + 'api/home', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  saveQuestion(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/save_question', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getUserWiseDiscount(): Observable<any> {
    return this.http.get(this.endPoint + 'api/get_userwise_discount', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  saveVoucher(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/save_voucher', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getSubscription(): Observable<any> {
    return this.http.get(this.endPoint + 'api/get_subscription', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  saveSubscription(isSelected): Observable<any> {
    const args: any = { is_selected: isSelected };
    return this.http.post(this.endPoint + 'api/save_subscription', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getManufacturerList(): Observable<any> {
    return this.http.get(this.endPoint + 'api/get_manufacturer_list', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getShippingCharge(): Observable<any> {
    return this.http.get(this.endPoint + 'api/get_shipping_charge', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getPaymentUrl(): Observable<any> {
    return this.http.get(this.endPoint + 'api/get_payment_url', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  paymentSuccess(data, ss1, ss2): Observable<any> {
    const parameter =
      '?data=' + data + '&answer=accept&ss1=' + ss1 + '&ss2=' + ss2;
    return this.http.get(this.endPoint + 'api/payment_success' + parameter, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  saveProductReview(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/save_product_review', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getProductReview(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/get_product_review', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getProductDiscount(productId): Observable<any> {
    const args: any = { productId };
    return this.http.post(this.endPoint + 'api/get_product_discount', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getShippingAddressList(): Observable<any> {
    return this.http.get(environment.SHIPPING_API_URL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  applyCouponCode(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/apply_coupon_code', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  saveReport(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/save_report', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  applyProductCouponCode(args): Observable<any> {
    return this.http.post(
      this.endPoint + 'api/apply_product_coupon_code',
      args,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  searchProduct(args): Observable<any> {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.http.post(this.endPoint + 'api/search_product', args, {
      headers,
    });
  }

  getCareer(): Observable<any> {
    return this.http.get(this.endPoint + 'api/career');
  }



  getPowerData(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/get_power_data', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  updatePowerData(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/update_power_data', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getProductListByLimit(args): Observable<any> {
    return this.http.post(this.endPoint + 'api/product_list_by_offset', args, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  redirectToHome(): void {
    this.router.navigateByUrl(`/`);
  }
  redirectToLogin(): void {
    this.router.navigateByUrl(`prisijungti`);
  }

  redirectToProductList(categoryId: number, subCategoryId: number): void {
    this.router.navigateByUrl(`paieska?categoryId=${categoryId}&subCategoryId=${subCategoryId}`);
  }

  redirectToCategory(categorySlug: string): void {
    this.router.navigateByUrl(`category/${encodeURIComponent(categorySlug)}`);
  }

  redirectToProductDetails(productSlug: string): void {
    this.router.navigateByUrl(`product-details/${encodeURIComponent(productSlug)}`);
  }

  redirectToOrderList(): void {
    this.router.navigateByUrl(`/order-list`);
  }

  splitArray(array: any, size: number): Array<any> {
    const newArray = [];
    for (let i = 0; i < array.length; i += size) {
      newArray.push(array.slice(i, i + size));
    }
    return newArray;
  }
}
