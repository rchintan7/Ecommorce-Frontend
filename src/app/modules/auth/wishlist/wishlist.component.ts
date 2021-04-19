import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomOptions } from 'src/app/shared/models/constants';
import { CartService } from 'src/app/shared/services/cart.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationMaxSize, Product } from 'src/app/shared/models/constants';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WishlistComponent implements OnInit {
  page = 1;
  maxSize = PaginationMaxSize;
  maxRating = 5;
  totalProduct = 0;
  errorMessage = '';
  isReadOnly = true;
  selectedProduct: any;
  categories: any[] = [];
  productList: any[] = [];
  modalRef: BsModalRef;
  @ViewChild('template') template;
  suggestionProductList: any[] = [];
  customOptions = CustomOptions;
  selectedProductQuantity: number;
  selectedProductSuggestionTotal = 0;
  selectedSuggestionProduct: Array<number> = [];
  totalProductPrice: number = 0;
  selectedPowerOption: Array<any> = [];
  modalRef3: BsModalRef;
  productErrorMessage: string = "";
  @ViewChild('template3', { static: false }) template3;
  constructor(
    private commonApisService: CommonApisService,
    private modalService: BsModalService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchProdoctWishlist();
  }

  fetchProdoctWishlist(): void {
    this.commonApisService.fetchProdoctWishlist(this.page).subscribe(
      (response) => {
        if (response.success) {
          this.suggestionProductList = response.data.suggestion_product;
          this.productList = response.data.products;
          this.totalProduct = response.data.totalProduct;
        }
      },
      (error) => {
        console.log(`Api failed of product list ${error}`);
      }
    );
  }
  pageChanged($event): void {
    this.page = $event.page;
    this.fetchProdoctWishlist();
  }

  addToWishlist(productId: number, index: number): void {
    const isWishlistAdded = 0;
    if (this.authService.isLoggedIn()) {
      this.commonApisService
        .addToWishlist(isWishlistAdded, productId)
        .subscribe(
          (response) => {
            if (response.success) {
              this.productList.splice(index, 1);
              this.fetchProdoctWishlist();
            }
          },
          (error) => {
            console.log(`Add to wishlist api error ${error}`);
          }
        );
    }
  }
  checkAllOptionSelected(): boolean {
    let isValid = true;
    this.selectedPowerOption.forEach((outerElement, outerIndex) => {
      outerElement.forEach((innerElement, innerIndex) => {
        if (this.selectedPowerOption[outerIndex][innerIndex].value === '') {
          this.selectedPowerOption[outerIndex][innerIndex].message = this.selectedPowerOption[outerIndex][innerIndex].label + ' privalomas laukas';
          isValid = false;
        }
        else {
          this.selectedPowerOption[outerIndex][innerIndex].message = '';
        }
      });
    });
    return isValid;
  }
  openProductSuggestionModal(product: any, quantity: number): void {
    this.totalProductPrice = product.price;
    this.selectedProductSuggestionTotal = Number(this.totalProductPrice);
    if (this.selectedPowerOption.length) {
      if (!this.checkAllOptionSelected()) {
        return;
      }
    }
    this.selectedProduct = product;
    this.selectedProductQuantity = quantity;
    this.selectedSuggestionProduct = [];
    this.modalRef3 = this.modalService.show(this.template3, Object.assign({}, { class: 'gray modal-lg' }));
  }
  redirectToProductDetails(selectedProduct: any, redirectToProduct: boolean): void {
    if (redirectToProduct && selectedProduct.is_varition_exist) {
      this.commonApisService.redirectToProductDetails(selectedProduct.slug);
    }
    else {
      if(this.suggestionProductList.length) {
        this.openProductSuggestionModal(selectedProduct, 1);
    }
    else {
      this.selectedProductQuantity =1;
      this.selectedProduct = selectedProduct;
      this.addToCart();
    }
    }
  }

  addToCart(): void {
    const totalProduct =
      this.cartService.productCountById(this.selectedProduct.id) +
      this.selectedProductQuantity;
  //  if (this.selectedProduct.maximum_quantity >= totalProduct) {
      this.commonApisService
        .getProductDiscount(this.selectedProduct.id).subscribe(
          (response) => {
            const product = {
              id: this.selectedProduct.id,
              name: this.selectedProduct.product_name,
              price: Number(this.selectedProduct.price) - Number(response.data.discount),
              image: this.selectedProduct.image[0],
              warrantyYear: 0,
              warrantyPrice: 0,
              insuranceYear: 0,
              insurancePrice: 0,
              discount: response.data.discount,
              tags: this.selectedProduct.tag,
              maxQuantity: this.selectedProduct.maximum_quantity,
            };
            this.cartService.addToCart(product, this.selectedProductQuantity);
            this.router.navigate(['/atsiskaitymas']);
          },
          (error) => {
            console.log(`Get Product Discount error ${error}`);
          }
        );
    // } else {
    //   this.authService.errorMessage(
    //     `Leidžiama ne daugiau ${this.selectedProduct.maximum_quantity} kaip  produktams`
    //   );
    // }
  }

  openModal(product: any, quantity: number): void {
    this.selectedProduct = product;
    this.selectedProductQuantity = quantity;
    this.selectedSuggestionProduct = [];
    this.modalRef = this.modalService.show(
      this.template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  closeModal(): void {
    this.modalRef.hide();
    // this.addToCart();
  }

  onCheckSuggestionProduct(
    checked: boolean,
    index: number,
    productId: number
  ): void {
    if (checked) {
      this.selectedSuggestionProduct.push(productId);
    } else {
      this.selectedSuggestionProduct.splice(index, 1);
    }
    this.calculateSuggestionProduct();
  }

  calculateSuggestionProduct(): void {
    this.selectedProductSuggestionTotal = 0;
    this.selectedSuggestionProduct.forEach((element) => {
      const findElement = this.suggestionProductList.find(
        (ele) => ele.id === element
      );
      this.selectedProductSuggestionTotal +=
        findElement !== undefined ? Number(findElement.price) : 0;
    });
  }

  
	addToCartSuggestionProduct(): void {
		if (!this.selectedSuggestionProduct.length) {
			this.productErrorMessage = 'Pasirinkite bent vieną';
		}
		this.modalRef3.hide();
		this.commonApisService
			.getProductDiscount(this.selectedSuggestionProduct)
			.subscribe(
				(response) => {
					if (response.success) {
						const productWiseDiscount = [
							...Array(this.selectedSuggestionProduct.length).keys(),
						].map((x) => 0);
						if (response.data.length) {
							this.selectedSuggestionProduct.forEach((element) => {
								const findElement = response.data.find(
									(ele) => ele.product_id === element
								);
								productWiseDiscount.push(
									findElement !== undefined ? findElement.discount : 0
								);
							});
						}
						this.selectedSuggestionProduct.forEach((element, index) => {
							const findElement = this.suggestionProductList.find((ele) => ele.id === element);
							if (findElement) {
								const totalProduct = this.cartService.productCountById(findElement.id) + 1;
							//	if (findElement.maximum_quantity >= totalProduct) {
									const product: Product = {
										id: findElement.id,
										name: findElement.product_name,
										price: Number(findElement.price) - Number(productWiseDiscount[index]),
										image: findElement.image[0],
										warrantyYear: 0,
										warrantyPrice: 0,
										insuranceYear: 0,
										insurancePrice: 0,
										discount: productWiseDiscount[index],
										tags: findElement.tag,
										maxQuantity: findElement.maximum_quantity,
										option: []
									};
									this.cartService.addToCart(product, 1);
							//	}
							}
						});
						this.addToCart();
					}
				},
				(error) => {
					console.log('Get Product Discount error', error);
				}
			);
	}
  decimalNumber(price: number): string {
		return this.cartService.decimalNumber(price);
	}
  
  closeProductSuggestionModal(): void {
    this.modalRef3.hide();
    this.addToCart();
}

}
