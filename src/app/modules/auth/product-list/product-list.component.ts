import { CustomOptions, PaginationMaxSize, SliderOptions } from 'src/app/shared/models/constants';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Options, ChangeContext } from 'ng5-slider';
import { Product } from 'src/app/shared/models/constants';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class ProductListComponent implements OnInit {

	page = 1;
	maxSize = PaginationMaxSize;
	minValue = 0;
	maxRating = 5;
	totalProduct = 0;
	maxValue = 1000;
	selectedProductSuggestionTotal = 0;
	isReadOnly = true;
	typeList: any = [];
	colorList: any[] = [];
	volumeList: any = [];
	seriesList: any[] = [];
	widthList: any[] = [];
	categories: any[] = [];
	capacityList: any[] = [];
	productList: any[] = [];
	materialList: any[] = [];
	longSizeList: any[] = [];
	selectedManufacture: any[] = [];
	selectedDeliveryType: any[] = [];
	selectedTypeList: any[] = [];
	selectedColorList: any[] = [];
	selectedVolumeList: any[] = [];
	selectedSeriesList: any[] = [];
	selectedWidthList: any[] = [];
	selectedCapacityList: any[] = [];
	selectedMaterialList: any[] = [];
	selectedLongSizeList: any[] = [];
	deliveryTypeList: Array<string> = [];
	manufactureList: Array<string> = [];
	selectedSuggestionProduct: Array<number> = [];
	suggestionProductList: any[] = [];
	options: Options = SliderOptions;
	customOptions = CustomOptions;
	search: string;
	categoryId: string;
	subCategoryId: string;
	order = 'ASC';
	orderByColumnName = '';
	modalRef: BsModalRef;
	@ViewChild('template') template;
	selectedProductQuantity: number;
	selectedProduct: any;
	errorMessage = '';
	loading: boolean = false;
	totalProductPrice: number = 0;
	selectedPowerOption: Array<any> = [];
	modalRef3: BsModalRef;
	productErrorMessage: string = "";
	@ViewChild('template3', { static: false }) template3;
	constructor(
		private activatedRoute: ActivatedRoute,
		private modalService: BsModalService,
		private commonApisService: CommonApisService,
		private authService: AuthService,
		private cartService: CartService,
		private router: Router
	) {
		this.activatedRoute.queryParams.subscribe(
			(params: {
				manufacturer: string;
				categoryId: string;
				subCategoryId: string;
				search: string;
			}) => {
				if (params.manufacturer) {
					this.selectedManufacture.push(params.manufacturer);
				} else {
					this.categoryId = params.categoryId;
					this.subCategoryId = params.subCategoryId;
					this.search = params.search;
					this.page = 1;
				}
				this.fetchProductList(
					this.categoryId,
					this.subCategoryId,
					this.search,
					this.minValue,
					this.maxValue,
					this.selectedManufacture.toString(),
					this.selectedDeliveryType.toString(),
					this.order,
					this.orderByColumnName,
					this.page
				);
			}
		);
	}

	ngOnInit(): void {
		this.fetchManufactureDeliveryTypeList();
	}

	fetchProductListTest(): void {
		const data = {
			page: this.page,
			order: this.order,
			search: this.search,
			min_price: this.minValue,
			max_price: this.maxValue,
			category_id: this.categoryId,
			sub_category_id: this.subCategoryId,
			orderByColumnName: this.orderByColumnName,
			type_list: this.selectedTypeList.toString(),
			color_list: this.selectedColorList.toString(),
			volume_list: this.selectedVolumeList.toString(),
			series_list: this.selectedSeriesList.toString(),
			width_list: this.selectedWidthList.toString(),
			capacity_list: this.selectedCapacityList.toString(),
			material_list: this.selectedMaterialList.toString(),
			long_size_list: this.selectedLongSizeList.toString(),
			manufacture: this.selectedManufacture.toString(),
			delivery_type: this.selectedDeliveryType.toString(),
		};
		this.loading = true;
		this.commonApisService.fetchProductListTest(data).subscribe(
			(response) => {
				this.loading = false;
				if (response.success) {
					this.productList = response.data.products;
					this.suggestionProductList = response.data.suggestion_product;
					this.totalProduct = response.data.totalProduct;
				}
			},
			(error) => {
				this.loading = false;
				console.log('api failed of product list', error);
			}
		);
	}
	fetchProductList(
		categoryId,
		subCategoryId,
		search,
		minPrice = 0,
		maxPrice = 0,
		manufacture = '',
		deliveryType = '',
		order = 'ASC',
		orderByColumnName = '',
		page
	): void {
		this.loading = true;
		this.commonApisService
			.fetchProductList(
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
			)
			.subscribe(
				(response) => {
					this.loading = false;
					if (response.success) {
						this.productList = response.data.products;
						this.suggestionProductList = response.data.suggestion_product;
						this.totalProduct = response.data.totalProduct;
					}
				},
				(error) => {
					this.loading = false;
					console.log('api failed of product list', error);
				}
			);
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

	onUserChangeEnd(changeContext: ChangeContext): void {
		this.page = 1;
		this.fetchProductList(
			this.categoryId,
			this.subCategoryId,
			this.search,
			this.minValue,
			this.maxValue,
			this.selectedManufacture.toString(),
			this.selectedDeliveryType.toString(),
			this.order,
			this.orderByColumnName,
			this.page
		);
	}

	onCheckBoxChange(
		value: string,
		items: Array<string>,
		checked: boolean
	): void {
		if (checked) {
			items.push(value);
		} else {
			const index = items.findIndex((element) => element === value);
			if (index > -1) {
				items.splice(index, 1);
			}
		}
		this.page = 1;
		this.fetchProductList(
			this.categoryId,
			this.subCategoryId,
			this.search,
			this.minValue,
			this.maxValue,
			this.selectedManufacture.toString(),
			this.selectedDeliveryType.toString(),
			this.order,
			this.orderByColumnName,
			this.page
		);
	}
	checkItemExist(selectedItem: string, items: Array<string>): boolean {
		return items.findIndex((element) => element === selectedItem) > -1
			? true
			: false;
	}

	changeOrder(value: string): void {
		switch (value) {
			case '1':
				this.order = 'ASC';
				break;
			case '2':
				this.orderByColumnName = 'name';
				this.order = 'ASC';
				break;
			case '3':
				this.orderByColumnName = 'name';
				this.order = 'DESC';
				break;
			case '4':
				this.orderByColumnName = 'price';
				this.order = 'ASC';
				break;
			case '5':
				this.orderByColumnName = 'price';
				this.order = 'DESC';
				break;
			case '6':
				this.orderByColumnName = 'rating';
				this.order = 'DESC';
				break;
			case '7':
				this.orderByColumnName = 'rating';
				this.order = 'ASC';
				break;
		}
		this.page = 1;
		this.fetchProductList(
			this.categoryId,
			this.subCategoryId,
			this.search,
			this.minValue,
			this.maxValue,
			this.selectedManufacture.toString(),
			this.selectedDeliveryType.toString(),
			this.order,
			this.orderByColumnName,
			this.page
		);
	}

	fetchManufactureDeliveryTypeList(): void {
		this.commonApisService.fetchManufactureDeliveryTypeList().subscribe(
			(response) => {
				if (response.success) {
					this.deliveryTypeList = response.data.delivery_type;
					this.manufactureList = response.data.manufacture;
					this.longSizeList = response.data.long_size_list;
					this.materialList = response.data.material_list;
					this.capacityList = response.data.capacity_list;
					this.volumeList = response.data.volume_list;
					this.seriesList = response.data.series_list;
					this.widthList = response.data.width_list;
					this.colorList = response.data.color_list;
					this.typeList = response.data.type_list;
				}
			},
			(error) => {
				console.log('Filter Api error', error);
			}
		);
	}

	pageChanged($event: any): void {
		this.page = $event.page;
		this.fetchProductList(
			this.categoryId,
			this.subCategoryId,
			this.search,
			this.minValue,
			this.maxValue,
			this.selectedManufacture.toString(),
			this.selectedDeliveryType.toString(),
			this.order,
			this.orderByColumnName,
			this.page
		);
	}

	addToWishlist(
		isWishlistAdded: number,
		productId: number,
		index: number
	): void {
		isWishlistAdded = isWishlistAdded ? 0 : 1;
		if (this.authService.isLoggedIn()) {
			this.commonApisService
				.addToWishlist(isWishlistAdded, productId)
				.subscribe(
					(response) => {
						if (response.success) {
							this.productList[index].isWishlistAdded = isWishlistAdded;
						}
					},
					(error) => {
						console.log('Add to wishlist api error', error);
					}
				);
		} else {
			this.commonApisService.redirectToLogin();
		}
	}

	// addToCart(): void {
	//   const totalProduct =
	//     this.cartService.productCountById(this.selectedProduct.id) +
	//     this.selectedProductQuantity;
	//   if (this.selectedProduct.maximum_quantity >= totalProduct) {
	//     this.commonApisService
	//       .getProductDiscount(this.selectedProduct.id)
	//       .subscribe(
	//         (response) => {
	//           const product: Product = {
	//             id: this.selectedProduct.id,
	//             name: this.selectedProduct.product_name,
	//             price:
	//               Number(this.selectedProduct.price) -
	//               Number(response.data.discount),
	//             image: this.selectedProduct.image[0],
	//             warrantyYear: 0,
	//             warrantyPrice: 0,
	//             insuranceYear: 0,
	//             insurancePrice: 0,
	//             discount: response.data.discount,
	//             tags: this.selectedProduct.tag,
	//             maxQuantity: this.selectedProduct.maximum_quantity,
	//           };
	//           this.cartService.addToCart(product, this.selectedProductQuantity);
	//           this.router.navigate(['/atsiskaitymas']);
	//         },
	//         (error) => {
	//           console.log('Get Product Discount error', error);
	//         }
	//       );
	//   } else {
	//     this.authService.errorMessage(
	//       `Leidžiama ne daugiau ${this.selectedProduct.maximum_quantity} kaip  produktams`
	//     );
	//   }
	// }

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

	// onCheckSuggestionProduct(
	//   checked: boolean,
	//   index: number,
	//   productId: number
	// ): void {
	//   if (checked) {
	//     this.selectedSuggestionProduct.push(productId);
	//   } else {
	//     this.selectedSuggestionProduct.splice(index, 1);
	//   }
	//   this.calculateSuggestionProduct();
	// }

	// calculateSuggestionProduct(): void {
	//   this.selectedProductSuggestionTotal = 0;
	//   this.selectedSuggestionProduct.forEach((element) => {
	//     const findElement = this.suggestionProductList.find(
	//       (ele) => ele.id === element
	//     );
	//     this.selectedProductSuggestionTotal +=
	//       findElement !== undefined ? Number(findElement.price) : 0;
	//   });
	// }

	// addToCartSuggestionProduct(): void {
	//   if (!this.selectedSuggestionProduct.length) {
	//     this.errorMessage = 'Pasirinkite bent vieną';
	//   }
	//   this.modalRef.hide();
	//   this.commonApisService
	//     .getProductDiscount(this.selectedSuggestionProduct)
	//     .subscribe(
	//       (response) => {
	//         if (response.success) {
	//           const productWiseDiscount = [
	//             ...Array(this.selectedSuggestionProduct.length).keys(),
	//           ].map((x) => 0);
	//           if (response.data.length) {
	//             this.selectedSuggestionProduct.forEach((element) => {
	//               const findElement = response.data.find(
	//                 (ele) => ele.product_id === element
	//               );
	//               productWiseDiscount.push(
	//                 findElement !== undefined ? findElement.discount : 0
	//               );
	//             });
	//           }
	//           this.selectedSuggestionProduct.forEach((element, index) => {
	//             const findElement = this.suggestionProductList.find(
	//               (ele) => ele.id === element
	//             );
	//             if (findElement) {
	//               const totalProduct =
	//                 this.cartService.productCountById(findElement.id) + 1;
	//               if (findElement.maximum_quantity >= totalProduct) {
	//                 const product: Product = {
	//                   id: findElement.id,
	//                   name: findElement.product_name,
	//                   price:
	//                     Number(findElement.price) -
	//                     Number(productWiseDiscount[index]),
	//                   image: findElement.image[0],
	//                   warrantyYear: 0,
	//                   warrantyPrice: 0,
	//                   insuranceYear: 0,
	//                   insurancePrice: 0,
	//                   discount: productWiseDiscount[index],
	//                   tags: findElement.tag,
	//                   maxQuantity: findElement.maximum_quantity,
	//                 };
	//                 this.cartService.addToCart(product, 1);
	//               }
	//             }
	//           });
	//           this.addToCart();
	//         }
	//       },
	//       (error) => {
	//         console.log('Get Product Discount error', error);
	//       }
	//     );
	// }

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
								//}
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
