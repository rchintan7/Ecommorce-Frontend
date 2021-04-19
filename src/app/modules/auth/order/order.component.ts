import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { Component, ViewChild, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ValidationErrors } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { EmailPattern } from 'src/app/shared/models/constants';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class OrderComponent implements OnInit {
	// tslint:disable-next-line: indent
	@ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
	modalRef: BsModalRef;
	items: any[] = [];
	addressList: any[] = [];
	loginForm: FormGroup;
	registerForm: FormGroup;
	withoutLoginForm: FormGroup;
	isLogin = false;
	submitted = false;
	isSubmitted = false;
	isSelfPickup = '1';
	withOutLoign = false;
	isUserIndividual = false;
	isDiscountApply = false;
	registerSubmitted = false;
	isUserLegalPerson = false;
	isCouponCodeApply = false;
	applyShiipingCharge = false;
	isAuthorizedPersonPickup = false;
	withOutLoginSubmitted = false;
	name = '';
	email = '';
	phone = '';
	address = '';
	totalPrice = '';
	couponCode = '';
	discountType = '';
	customClass = '';
	discountPrice = '';
	errorMessage = '';
	selectedBank = '1';
	totalDiscountPrice = '';
	selectedCouponCode = '';
	registerErrorMessage = '';
	couponCodeErrorMessage = '';
	couponCodeSuccessMessage = '';
	userTypeError = '';
	couponId = 0;
	selectedTab = 1;
	totalQuantity = 0;
	shppingCharge = 0;
	discountPercentage = 0;
	selectedShippingType = 1;
	minimumOrderAmount = 0;
	@ViewChild('template') template;
	withOutLoginUserTypeError = '';
	productCouponCode = '';
	productCouponError = '';
	selectedProductId = 0;
	selectedOrderIndex = 0;
	comment = "";
	constructor(
		private modalService: BsModalService,
		private commonApisService: CommonApisService,
		private cartService: CartService,
		private authService: AuthService,
		private formBuilder: FormBuilder
	) { }

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
		});
		this.registerForm = this.formBuilder.group({
			name: ['', Validators.required],
			role: ['2', Validators.required],
			phone: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			companyName: [''],
			companyCode: [''],
			pvmCode: [''],
			userType: ['1']
		});
		this.withoutLoginForm = this.formBuilder.group({
			name: ['',Validators.required],
			phone: ['', Validators.required],
			email: ['',[Validators.required,Validators.email]],
			address: ['',Validators.required],
			companyName: [''],
			companyCode: [''],
			pvmCode: [''],
			quickShop: ['1'],
			comment: ['']
		});
		this.getShippingAddressList();
		this.getShippingCharge();
		this.getAllCartItem();
		this.getUserWiseDiscount();
		this.isLogin = this.authService.isLoggedIn();
		this.customClass = this.isLogin ? 'd-none' : '';
		this.registerForm.get('userType').valueChanges.subscribe(val => {
			this.registerForm.get('companyName').setValidators(val==2 ? [Validators.required] : null);
			this.registerForm.get('companyCode').setValidators(val==2 ? [Validators.required] : null);
			this.registerForm.get('pvmCode').setValidators(val==2 ? [Validators.required] : null);
			this.registerForm.updateValueAndValidity();
		});

		this.withoutLoginForm.get('quickShop').valueChanges.subscribe(value => {
			const first = (this.withoutLoginForm.value.quickShop==1 || this.withoutLoginForm.value.quickShop==2) && value;
			const second = this.withoutLoginForm.value.quickShop==2 && value;
			this.withoutLoginForm.get('name').setValidators(first ? [Validators.required] : null);
			this.withoutLoginForm.get('email').setValidators(first ? [Validators.required, Validators.email] : null);
			this.withoutLoginForm.get('address').setValidators(first ? [Validators.required] : null);	
			this.withoutLoginForm.get('companyName').setValidators(second ? [Validators.required] : null);
			this.withoutLoginForm.get('companyCode').setValidators(second ? [Validators.required] : null);
			this.withoutLoginForm.get('pvmCode').setValidators(second ? [Validators.required] : null);
			this.withoutLoginForm.updateValueAndValidity();
		});
		this.cartService.quantityRemoveSubscription.subscribe((response) => {
			this.getShippingAddressList();
			this.getShippingCharge();
			this.getAllCartItem();
			this.getUserWiseDiscount();
		});
	}

	getShippingCharge(): void {
		this.commonApisService.getShippingCharge().subscribe(
			(response) => {
				if (response.success) {
					this.shppingCharge = Number(response.data.shpping_charge);
				}
			},(error) => {
				console.log('Fetch Shipping Charge Api Error', error);
			}
		);
	}

	addShippingCharge(): void {
		if (this.applyShiipingCharge) {
			this.totalPrice = Number(Number(this.totalPrice) + Number(this.shppingCharge)).toFixed(2);
		} else {
			this.totalPrice = Number(Number(this.totalPrice) - Number(this.shppingCharge)).toFixed(2);
		}
	}

	onChangeShipping(index: number): void {
		if (index !== 3) {
			this.address = '';
		}
		this.selectedShippingType = index;
		if (this.selectedShippingType === 2) {
			if (!this.applyShiipingCharge) {
				this.applyShiipingCharge = true;
				this.addShippingCharge();
			}
		} else {
			if (this.applyShiipingCharge) {
				this.applyShiipingCharge = false;
				this.addShippingCharge();
			}
		}
		this.calculateTotalPrice();
	}

	getUserWiseDiscount(): void {
		this.commonApisService.getUserWiseDiscount().subscribe((response) => {
			if (response.success) {
				this.isDiscountApply = true;
				this.discountPercentage = response.data.discount_percentage;
				this.discountPrice = Number((Number(this.totalPrice) * this.discountPercentage) / 100).toFixed(2);
				this.totalDiscountPrice = Number(Number(this.totalPrice) - Number(this.discountPrice)).toFixed(2);
			}
		},(error) => {
			console.log(`Ger User Wise discount ${error}`);
		});
	}

	getAllCartItem(): void {
		this.cartService.loadCart();
		this.items = this.cartService.getCartItem();
		this.calculateTotalPrice();
	}

	decreaseProductQuantity(index: number, quantity: number): void {
		if (quantity === 1) {
			this.items.splice(index, 1);
			this.cartService.removeItem(index);
		} else {
			this.items[index].quantity = this.items[index].quantity - 1;
			this.quanityChange(index, this.items[index].quantity);
		}
		this.calculateTotalPrice();
	}

	increaseProductQuantity(index: number, quantity: number): void {
		const totalProduct = this.cartService.productCountById(this.items[index].product.id) + quantity;
		//if (this.items[index].product.maxQuantity >= totalProduct) {
			this.items[index].quantity = this.items[index].quantity + 1;
			this.quanityChange(index, this.items[index].quantity);
			this.calculateTotalPrice();
		// } else {
		// 	this.authService.errorMessage(`Leidžiama ne daugiau ${this.items[index].product.maxQuantity}' kaip  produktams`);
		// }
	}

	quanityChange(index: number, quantity: number): void {
		this.cartService.quanityChange(index, quantity);
	}

	decimalNumber(price: number): string {
		return this.cartService.decimalNumber(price);
	}

	login(): void {
		this.submitted = true;
		if (this.loginForm.invalid) {
			return;
		}
		this.authService.loginUser(this.loginForm.value).subscribe(
			(response) => {
				if (response.success) {
					this.customClass = 'd-none';
					this.isLogin = true;
					this.errorMessage = '';
					this.authService.saveAuthData(response.data);
					this.getUserWiseDiscount();
				} else {
					this.errorMessage = response.message;
				}
			},
			(error) => {
				console.log(`Login api error ${error}`);
			}
		);
	}

	register(): void {
		this.registerSubmitted = true;
		if(this.registerForm.invalid) {
			return;
		}
		this.authService.saveUser(this.registerForm.value).subscribe((response) => {
			if (response.success) {
				this.isLogin = true;
				this.customClass = 'd-none';
				this.registerErrorMessage = '';
				this.authService.saveAuthData(response.data);
				this.getUserWiseDiscount();
			} else {
				this.registerErrorMessage = response.message;
			}
		},(error) => {
			console.log(`Register Api Error ${error}`);
		});
	}

	applyCouponCode(): void {
		if (this.couponCode) {
			const data = { coupon_code: this.couponCode, items: this.items };
			this.commonApisService.applyCouponCode(data).subscribe(
				(response) => {
					if (response.success) {
						if (response.data.discount.length) {
							response.data.discount.forEach((element) => {
								const findIndex = this.items.findIndex(
									(ele) => ele.product.id === element.id
								);
								if (findIndex > -1) {
									this.items[findIndex].product.price =
										Number(element.product_price) -
										Number(this.items[findIndex].product.discount);
								}
							});
							this.isCouponCodeApply = true;
							this.couponId = response.data.id;
							this.couponCodeErrorMessage = '';
							this.couponCodeSuccessMessage = 'Kupono kodas sėkmingai taikomas';
							this.calculateTotalPrice();
						}
					} else {
						this.couponCodeSuccessMessage = '';
						this.couponCodeErrorMessage = response.message;
					}
				},
				(error) => {
					console.log(`Apply Cupon Code Api Error ${error}`);
				}
			);
		}
	}

	calculateTotalPrice(): void {
		this.totalPrice = '0';
		this.totalQuantity = 0;
		this.items.forEach((element) => {
			this.totalQuantity = Number(this.totalQuantity) + Number(element.quantity);
			this.totalPrice = Number(Number(this.totalPrice) + Number(element.product.price * element.quantity)).toFixed(2);
		});
		if (this.applyShiipingCharge) {
			this.totalPrice = Number(Number(this.totalPrice) + Number(this.shppingCharge)).toFixed(2);
		}
		if (this.isDiscountApply) {
			this.discountPrice = Number((Number(this.totalPrice) * this.discountPercentage) / 100).toFixed(2);
			this.totalDiscountPrice = Number(Number(this.totalPrice) - Number(this.discountPrice)).toFixed(2);
		}
	}

	placeOrder(): boolean {
		this.isSubmitted = true;
		if ((!(this.name && this.phone && this.email && this.address && this.email.match(EmailPattern))
			&& (this.selectedShippingType === 2 || this.isAuthorizedPersonPickup)) || (!this.address && this.selectedShippingType === 3)) {
			return false;
		}
		if (!this.authService.isLoggedIn() && !this.withOutLoign) {
			this.withOutLoginSubmitted = true;
			if (this.withoutLoginForm.invalid) {
				return;
			}
		}
		const formdata = new FormData();
		if (this.items.length) {
			if (!this.authService.isLoggedIn()) {
				formdata.append('guest_company_name', this.withoutLoginForm.value.companyName);
				formdata.append('guest_company_code', this.withoutLoginForm.value.companyCode);
				formdata.append('guest_vat_code', this.withoutLoginForm.value.pvmCode);
				formdata.append('guest_name', this.withoutLoginForm.value.name);
				formdata.append('guest_email', this.withoutLoginForm.value.email);
				formdata.append('guest_phone_number', this.withoutLoginForm.value.phone);
				formdata.append('guest_address', this.withoutLoginForm.value.address);
			}
			formdata.append('amount', this.totalPrice);
			formdata.append('quantity', this.totalQuantity.toString());
			formdata.append('bank_type', this.selectedBank.toString());
			formdata.append('shipping_type', this.selectedShippingType.toString());
			this.items.forEach((element, index) => {
				formdata.append(`order[${index}][warranty_amount]`, element.product.warrantyPrice);
				formdata.append(`order[${index}][warranty_year]`, element.product.warrantyYear);
				formdata.append(`order[${index}][insurance_amount]`, element.product.insurancePrice);
				formdata.append(`order[${index}][insurance_year]`, element.product.insuranceYear);
				formdata.append(`order[${index}][discount]`, element.product.discount);
				formdata.append(`order[${index}][amount]`, element.product.price);
				formdata.append(`order[${index}][option]`, JSON.stringify(element.product.option));
				if (element.product.couponCode !== '' && element.product.couponCode !== undefined) {
					formdata.append(`order[${index}][coupon_code]`, element.product.couponCode);
					formdata.append(`order[${index}][coupon_id]`, element.product.couponId);
				}
				formdata.append(`order[${index}][product_id]`, element.product.id);
				formdata.append(`order[${index}][quantity]`, element.quantity);
			});
			if (this.isCouponCodeApply) {
				formdata.append('coupon_code', this.couponCode);
			}
			if (this.isDiscountApply) {
				formdata.append('total_amount', this.totalDiscountPrice);
				formdata.append('discount_amount', this.discountPrice);
				formdata.append('discount_percentage', this.discountPercentage.toString());
			} else {
				formdata.append('total_amount', this.totalPrice);
			}
			if (this.applyShiipingCharge) {
				formdata.append('shipping_amount', this.shppingCharge.toString());
				formdata.append('name', this.name);
				formdata.append('email', this.email);
				formdata.append('phone', this.phone);
			}
			if (this.selectedShippingType === 2 || this.selectedShippingType === 3) {
				formdata.append('address', this.address);
			}
			formdata.append('is_self_pickup', this.isSelfPickup ? '1' : '0');
			formdata.append('is_authorized_person_pickup', this.isSelfPickup ? '0' : '1');
			formdata.append('comment',this.withoutLoginForm.value.comment);
			this.cartService.placeOrder(formdata).subscribe(
				(response) => {
					if (response.success) {
						if(!["7","8"].includes(this.selectedBank)) {
							window.location.href = response.data.url;
						}
						else {
							if (this.authService.isLoggedIn()) {
								this.commonApisService.redirectToOrderList();
							}
							else {
								this.commonApisService.redirectToHome();
							}
						}
					} else {
						this.authService.errorMessage(response.message);
					}
				},
				(error) => {
					this.authService.errorMessage('Pirmiausia prisijunkite');
					console.log(`Apply Cupon Code Api ${error}`);
				}
			);
		} else {
			this.authService.errorMessage('Jūsų krepšelis šiuo metu tuščias');
		}
	}

	emailValidate(email: string): boolean {
		if (email) {
			return email.match(EmailPattern) ? false : true;
		} else {
			return false;
		}
	}

	getShippingAddressList(): void {
		this.commonApisService.getShippingAddressList().subscribe(
			(response) => {
				this.addressList = response;
			},
			(error) => {
				console.log(`Get Shipping Address Api ${error}`);
			}
		);
	}

	changeTab(tab: number): void {
		this.address = '';
		this.selectedTab = tab;
	}

	onSelectAddress(value: string): void {
		this.onChangeShipping(3);
	}

	openCouponModal(selectedOrderIndex: number, productId: number, template: TemplateRef<any>): void {
		this.productCouponError = '';
		this.selectedProductId = productId;
		this.selectedOrderIndex = selectedOrderIndex;
		this.productCouponCode = '';
		this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray' }));
	}

	productApplyCouponCode(): void {
		this.productCouponError = '';
		if (this.productCouponCode !== '') {
			this.commonApisService.applyProductCouponCode({ coupon_code: this.productCouponCode, product_id: this.selectedProductId }).subscribe(
				(response) => {
					if (response.success) {
						this.items[this.selectedOrderIndex].product.price = response.data.price;
						this.items[this.selectedOrderIndex].product.couponCode = response.data.coupon_code;
						this.items[this.selectedOrderIndex].product.couponId = response.data.coupon_id;
						this.calculateTotalPrice();
						this.authService.sucessMessage(response.message);
						this.modalRef.hide();
					} else {
						this.productCouponError = response.message;
					}
				},
				(error) => {
					this.authService.errorMessage('Pirmiausia prisijunkite');
					console.log(`Product Apply Cupon Code Api Error  ${error}`);
				});
		}
		else {
			return;
		}
	}
}
