import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { CustomOptions,Product } from 'src/app/shared/models/constants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { BsModalService,BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

	defualtImage = environment.DEFAULT_IMAGE_URL;
	maxRating = 5;
	isReadOnly = true;
	iconList: any[] = [];
	banners: any[] = [];
	categories: any[] = [];
	companyLogos: any[] = [];
	listOfOffsets: number[] = [];
	categorySections: any[] = [];
	mainBannerSection: any[] = [];
	specialOfferProducts: any[] = [];
	customOptions: OwlOptions = CustomOptions;
	totalProductPrice:number = 0;
	selectedProductQuantity:number = 1;
	selectedProductSuggestionTotal:number = 0;
	selectedPowerOption:Array<any> = [];
	selectedSuggestionProduct:Array<number> = [];
	selectedProduct:any = {};
	modalRef3: BsModalRef;
	suggestionProductList: any[] = [];
	productErrorMessage:string = "";
	@ViewChild('template3', { static: false }) template3;
	@ViewChild('searchResults') searchResults: ElementRef;	
	constructor (
		private commonApisService: CommonApisService,
		private authService: AuthService,
		private cartService: CartService,
		private router: Router,
		private modalService:BsModalService
	) { }

	ngOnInit(): void {
		this.home();
	}

	home(): void {
		this.commonApisService.home().subscribe((response) => {
			if (response.success) {
				this.specialOfferProducts = response.data.special_offer_product;
				this.suggestionProductList = response.data.suggestion_product;
				this.categorySections = response.data.category_section;
				this.companyLogos = response.data.logo_section;
				this.mainBannerSection = response.data.slider;
				this.iconList = response.data.icon_list_section;
				this.banners = response.data.banner_section;
				this.categories = response.data.category;
			}
		},
		(error) => {
			console.log(`Home api error: ${error}`);
		});
	}

	showMore(categorySlug: string): void {
		this.commonApisService.redirectToCategory(categorySlug);
	}

	redirectToProductList(categorySlug: string, categoryId: number, subCategoryId: number, isParentCategory: number): void {
		if (isParentCategory === 0) {
			this.commonApisService.redirectToProductList(categoryId, subCategoryId);
		} else {
			this.showMore(categorySlug);
		}
	}

	redirectToProductDetails(selectedProduct: any, redirectToProduct: boolean): void {
		if (redirectToProduct || selectedProduct.is_varition_exist) {
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
	

	addToWishlist(isWishlistAdded: number, productId: number, type: string, index: number, i: number = 0): void {
		isWishlistAdded = isWishlistAdded ? 0 : 1;
		if (this.authService.isLoggedIn()) {
			this.commonApisService.addToWishlist(isWishlistAdded, productId)
				.subscribe((response) => {
					if (response.success) {
						type === 'specialOfferProducts' ? (this.specialOfferProducts[index].isWishlistAdded = isWishlistAdded)
						:
						(this.categorySections[i].products[index].isWishlistAdded = isWishlistAdded);
					}
				},
				(error) => {
					console.log(`Add to wishlist api error ${error}`);
				});
		} else {
			this.commonApisService.redirectToLogin();
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

    closeProductSuggestionModal(): void {
        this.modalRef3.hide();
        this.addToCart();
    }

	addToCart(): void {
		const powerOption = [];
		this.selectedPowerOption.forEach((outerElement) => {
			outerElement.forEach((innerElement) => {
				powerOption.push({ 
					value: innerElement.value, 
					option_id: innerElement.optionId, 
					variation_type: innerElement.variation_type 
				});
			});
		});
		const product: Product = {
			id: this.selectedProduct.id,
			name: this.selectedProduct.product_name,
			price: this.selectedProduct.price,
			image: this.selectedProduct.image[0],
			warrantyYear: 0,
			warrantyPrice: 0,
			insuranceYear: 0,
			insurancePrice: 0,
			tags: this.selectedProduct.tag,
			discount: this.selectedProduct.discount,
			maxQuantity: this.selectedProduct.maximum_quantity,
			option: powerOption
		};
		this.cartService.addToCart(product, this.selectedProductQuantity);
		this.router.navigate(['/atsiskaitymas']);
		/*
        const totalProduct = this.cartService.productCountById(this.selectedProduct.id) + this.selectedProductQuantity;
        if (this.selectedProduct.maximum_quantity >= totalProduct) {
            const powerOption = [];
            this.selectedPowerOption.forEach((element) => {
                element.forEach((element1) => {
                    powerOption.push({ value: element1.value, option_id: element1.optionId, variation_type: element1.variation_type });
                });
            });
            this.commonApisService.getProductDiscount(this.selectedProduct.id).subscribe(
                (response) => {
                    const product: Product = {
                        id: this.selectedProduct.id,
                        name: this.selectedProduct.product_name,
                        price: this.totalProductPrice,
                        // price:Number(this.selectedProduct.price) + Number(this.selectedWarranty.price) +Number(this.selectedInsurance.price) -
                        //   Number(response.data.discount),
                        image: this.selectedProduct.image[0],
                        warrantyYear: 0,
                        warrantyPrice: 0,
                        discount: this.selectedProduct.discount,
                        insuranceYear: 0,
                        insurancePrice: 0,
                        tags: this.selectedProduct.tag,
                        maxQuantity: this.selectedProduct.maximum_quantity,
                        option: powerOption
                    };
                    this.cartService.addToCart(product, this.selectedProductQuantity);
                    this.router.navigate(['/atsiskaitymas']);
                },
                (error) => {
                    console.log(`Get Product Discount error ${error}`);
                }
            );
        } else {
            this.authService.errorMessage(
                `Leidžiama ne daugiau ${this.selectedProduct.maximum_quantity} kaip produktams`
            );
        }
		*/
    }

	decimalNumber(price: number): string {
        return this.cartService.decimalNumber(price);
    }
	onCheckSuggestionProduct(
        checked: boolean,
        index: number,
        productId: number
    ): void {
        if (checked) {
            this.selectedSuggestionProduct.push(productId);
        }
        else {
            const indexElement = this.selectedSuggestionProduct.findIndex(element => (element == productId));
            if (indexElement > -1) {
                this.selectedSuggestionProduct.splice(indexElement, 1);
            }
        }
        this.calculateSuggestionProduct();
    }

    calculateSuggestionProduct(): void {
        this.selectedProductSuggestionTotal = Number(this.totalProductPrice);
        this.selectedSuggestionProduct.forEach((element) => {
            const findElement = this.suggestionProductList.find((ele) => ele.id == element);
            this.selectedProductSuggestionTotal = findElement !== undefined ? (Number(findElement.price) + Number(this.selectedProductSuggestionTotal)) : 0;
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
                            const findElement = this.suggestionProductList.find(
                                (ele) => ele.id === element
                            );
                            if (findElement) {
                                const totalProduct = this.cartService.productCountById(findElement.id) + 1;
                             //   if (findElement.maximum_quantity >= totalProduct) {
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
                               // }
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
}
