import { EmailPattern, Product, Insurance, Warranty, CustomOptions } from 'src/app/shared/models/constants';
import { Component, ViewChild, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProductDetailsComponent implements OnInit {
    @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
    @ViewChild('template1', { static: false }) template1;
    @ViewChild('template2', { static: false }) template2;
    @ViewChild('template3', { static: false }) template3;
    setTimer;
    modalRef: BsModalRef;
    modalRef1: BsModalRef;
    modalRef2: BsModalRef;
    modalRef3: BsModalRef;
    selectedProductSuggestionTotal = 0;
    selectedProductQuantity: number;
    productErrorMessage = '';
    reviewForm: FormGroup;
    reportForm: FormGroup;
    selectedProduct: any;
    items: any[] = [];
    reviews: any[] = [];
    banners: any[] = [];
    relatedProductList: any[] = [];
    selectedSuggestionProduct: Array<number> = [];
    suggestionProductList: any[] = [];
    productId: string;
    productSlug: string;
    categoryId: string;
    subCategoryId: string;
    timer = '';
    errorMessage = '';
    selectedImage = '';
    successMessage = '';
    hide = true;
    clearTime = true;
    submitted = false;
    isLoggedIn = false;
    isReadOnly = true;
    isWarrnttyChecked = false;
    reportFormSubmitted = false;
    maxRating = 5;
    totalReviews = 0;
    productQuantity = 1;
    totalProductPrice = 0;
    totalProductComparePrice = 0;
    customOptions = CustomOptions;
    tips: any = {};
    productDetail: any = {};
    productOption: any[] = [];
    selectedWarranty: Warranty = {
        year: 0,
        price: 0,
    };
    selectedInsurance: Insurance = {
        year: 0,
        price: 0,
    };
    powerOptionList = [];
    selectedPowerOption = [];
    selectedStandardOption = [];
    pwrId = 0;
    singleProductPrice = 0;
    singleProductComparePrice = 0;
    constructor(
        private modalService: BsModalService,
        private activatedRoute: ActivatedRoute,
        private commonApiService: CommonApisService,
        private router: Router,
        private cartService: CartService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private sanitizer: DomSanitizer
    ) {
        this.activatedRoute.params.subscribe((params: { productSlug: string }) => {
            if (params.productSlug !== undefined) {
                this.productSlug = params.productSlug;
                this.fetchProductDetails();
            }
        });
    }

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.reviewForm = this.formBuilder.group({
            name: [''],
            email: [''],
            review: ['', Validators.required],
            rating: ['', Validators.required],
        });
        this.reportForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(EmailPattern)]],
            phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            message: ['', Validators.required],
            terms: ['', Validators.requiredTrue],
        });
        if (!this.isLoggedIn) {
            this.reviewForm.controls.name.setValidators(Validators.required);
            this.reviewForm.controls.email.setValidators([
                Validators.required,
                Validators.pattern(EmailPattern),
            ]);
        }
    }

    openModal(template: TemplateRef<any>): void {
        this.reportFormSubmitted = false;
        this.reportForm.reset();
        this.modalRef = this.modalService.show(template);
    }

    fetchProductDetails(): void {
        this.commonApiService.fetchProductDetails(this.productSlug).subscribe(
            (response) => {
                if (response.success) {
                    this.tips = response.data.tips;
                    this.reviews = response.data.reviews;
                    this.productDetail = response.data.product;
                    this.banners = response.data.banner_section;
                    this.totalReviews = response.data.total_reviews;
                    this.productOption = this.commonApiService.splitArray(response.data.product_option, 3);
                    this.relatedProductList = response.data.related_product;
                    this.suggestionProductList = response.data.suggestion_product;
                    this.productId = this.productDetail.id;
                    this.selectedImage = this.productDetail.image[0];
                    this.singleProductPrice = this.productDetail.price;
                    this.singleProductComparePrice = this.productDetail.comparision_price;
                    this.totalProductPrice = this.productDetail.price - this.productDetail.discount;
                    this.totalProductComparePrice = this.productDetail.comparision_price - this.productDetail.discount;
                    this.productDetail.long_description = this.sanitizer.bypassSecurityTrustHtml(this.productDetail.long_description);
                    this.productOption.forEach((outerElement, outerIndex) => {
                        this.selectedPowerOption[outerIndex] = [];
                        outerElement.forEach((innerElement, innerIndex) => {
                            this.selectedPowerOption[outerIndex][innerIndex] = {
                                value: '',
                                message: '',
                                optionId: innerElement.pwr_option_id,
                                label: innerElement.name,
                                variation_type: innerElement.variation_type
                            };
                        });
                    });
                    if (this.productDetail.discount_start_datetime && this.productDetail.discount_end_datetime) {
                        this.startTimer(this.productDetail.discount_start_datetime, this.productDetail.discount_end_datetime);
                    }
                }
            },
            (error) => {
                console.log(`Product Api Error ${error}`);
            }
        );
    }

    startTimer(startdate: string, enddate: string): void {
        if (
            new Date(startdate).getTime() < new Date().getTime() &&
            new Date(enddate).getTime() > new Date().getTime()
        ) {
            this.setTimer = setInterval(() => {
                const startDate = new Date().getTime();
                const endDate = new Date(enddate).getTime();
                if (endDate > startDate) {
                    const distance = Math.abs(endDate - startDate);
                    const days = Math.floor(distance / 86400000);
                    const hours = Math.floor((distance % 86400000) / 3600000);
                    const minutes = Math.floor((distance % 3600000) / 60000);
                    const seconds = Math.floor((distance % 60000) / 1000);
                    this.timer = `${days} d ${hours} h ${minutes} m ${seconds} s`;
                } else if (this.clearTime) {
                    this.timer = '';
                    clearInterval(this.setTimer);
                    this.fetchProductDetails();
                    this.clearTime = false;
                }
            }, 1000);
        }
    }

    decreaseProductQuantity(): void {
        const singleProduct = this.totalProductPrice / this.productQuantity;
        if (this.productQuantity > 1) {
            this.productQuantity--;
        }
        this.totalProductPrice = singleProduct * this.productQuantity;
    }

    increaseProductQuantity(): void {
        const singleProduct = this.totalProductPrice / this.productQuantity;
        this.productQuantity++;
        this.totalProductPrice = singleProduct * this.productQuantity;
    }

    calculatePrice(): void {
        // this.totalProductComparePrice =
        //   (Number(this.productDetail.comparision_price) +
        //     Number(this.selectedWarranty.price) +
        //     Number(this.selectedInsurance.price) -
        //     Number(this.productDetail.discount)) *
        //   this.productQuantity;
        // this.totalProductPrice =
        //   (Number(this.productDetail.price) +
        //     Number(this.selectedWarranty.price) +
        //     Number(this.selectedInsurance.price) -
        //     Number(this.productDetail.discount)) *
        //   this.productQuantity;
    }

    addToCart(): void {
        const totalProduct = this.cartService.productCountById(this.selectedProduct.id) + this.selectedProductQuantity;
    //    if (this.selectedProduct.maximum_quantity >= totalProduct) {
            const powerOption = [];
            this.selectedPowerOption.forEach((element) => {
                element.forEach((element1) => {
                    powerOption.push({ value: element1.value, option_id: element1.optionId, variation_type: element1.variation_type });
                });
            });
            this.commonApiService.getProductDiscount(this.selectedProduct.id).subscribe(
                (response) => {
                    const product: Product = {
                        id: this.selectedProduct.id,
                        name: this.selectedProduct.product_name,
                        price: this.totalProductPrice,
                        // price:Number(this.selectedProduct.price) + Number(this.selectedWarranty.price) +Number(this.selectedInsurance.price) -
                        //   Number(response.data.discount),
                        image: this.selectedProduct.image[0],
                        warrantyYear: this.selectedWarranty.year,
                        warrantyPrice: this.selectedWarranty.price,
                        discount: this.selectedProduct.discount,
                        insuranceYear: this.selectedInsurance.year,
                        insurancePrice: this.selectedInsurance.price,
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
        // } else {
        //     this.authService.errorMessage(
        //         `Leidžiama ne daugiau ${this.selectedProduct.maximum_quantity} kaip produktams`
        //     );
        // }
    }

    onChangeWarranty(index: number, warranty: Warranty[]): void {
        if (warranty[index] !== undefined) {
            this.selectedWarranty.year = warranty[index].year;
            this.selectedWarranty.price = warranty[index].price;
            this.calculatePrice();
        }
    }

    onChangeInsurance(index: number, insurance: Insurance[]): void {
        if (insurance[index] !== undefined) {
            this.selectedInsurance.year = insurance[index].year;
            this.selectedInsurance.price = insurance[index].price;
            this.calculatePrice();
        }
    }

    addToWishlist(args: any): void {
        args.isWishlistAdded = args.isWishlistAdded ? 0 : 1;
        if (this.authService.isLoggedIn()) {
            this.commonApiService.addToWishlist(args.isWishlistAdded, args.productId).subscribe(
                (response) => {
                    if (response.success) {
                        if (!args.hasOwnProperty('relatedProduct')) {
                            this.productDetail.isWishlistAdded = args.isWishlistAdded;
                        }
                    }
                },
                (error) => {
                    console.log(`Add to wishlist api error ${error}`);
                }
            );
        } else {
            this.commonApiService.redirectToLogin();
        }
    }

    warrnttyChecked(isChecked: boolean): void {
        this.isWarrnttyChecked = isChecked;
        if (!isChecked) {
            this.selectedWarranty.year = 0;
            this.selectedWarranty.price = 0;
            this.calculatePrice();
        }
    }

    decimalNumber(price: number): string {
        return this.cartService.decimalNumber(price);
    }

    redirectToOrder(): void {
        this.router.navigateByUrl('atsiskaitymas');
    }

    openContactForm(): void {
        this.authService.contactFormSubscription.next(1);
    }

    getReviews(): void {
        this.commonApiService.getProductReview({ product_id: this.productId }).subscribe(
            (response) => {
                if (response.success) {
                    this.totalReviews = 0;
                    this.reviews = response.data;
                } else {
                    this.authService.errorMessage(response.message);
                }
            },
            (error) => {
                console.log(`Get review api error ${error}`);
            }
        );
    }

    openReviewModal(): void {
        this.modalRef1 = this.modalService.show(this.template1);
    }

    closeReviewModal(): void {
        this.modalRef1.hide();
    }

    saveReview(): boolean {
        this.submitted = true;
        if (this.reviewForm.invalid) {
            return false;
        }
        const data = {
            ...this.reviewForm.value,
            ...{ product_id: this.productId },
        };
        this.commonApiService.saveProductReview(data).subscribe(
            (response) => {
                if (response.success) {
                    this.modalRef1.hide();
                    this.submitted = false;
                    this.reviewForm.reset();
                    this.authService.sucessMessage(response.message);
                } else {
                    this.authService.errorMessage(response.message);
                }
            },
            (error) => {
                console.log(`Review api error : ${error}`);
            }
        );
    }

    imageZoom(imgID: any, resultID: any): void {
        this.hide = false;
        // tslint:disable-next-line: one-variable-per-declaration
        let img, lens, result, cx, cy;
        img = document.getElementById(imgID);
        result = document.getElementById(resultID);

        if (document.getElementById('zoom-image') != null) {
            lens = document.getElementById('zoom-image');
        } else {
            lens = document.createElement('DIV');
            lens.setAttribute('class', 'img-zoom-lens');
            lens.setAttribute('id', 'zoom-image');
            img.parentElement.insertBefore(lens, img);
        }
        cx = 7.5;
        cy = 7.5;
        result.style.backgroundImage = `url('${img.src}')`;
        result.style.backgroundSize = img.width * cx + 'px ' + img.height * cy + 'px';
        lens.addEventListener('mousemove', moveLens);
        img.addEventListener('mousemove', moveLens);
        lens.addEventListener('touchmove', moveLens);
        img.addEventListener('touchmove', moveLens);
        function moveLens(e): void {
            // tslint:disable-next-line: one-variable-per-declaration
            let pos, x, y;
            e.preventDefault();
            pos = getCursorPos(e);
            x = pos.x - lens.offsetWidth / 2;
            y = pos.y - lens.offsetHeight / 2;
            if (x > img.width - lens.offsetWidth) {
                x = img.width - lens.offsetWidth;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > img.height - lens.offsetHeight) {
                y = img.height - lens.offsetHeight;
            }
            if (y < 0) {
                y = 0;
            }
            lens.style.left = x + 'px';
            lens.style.top = y + 'px';
            result.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px';
        }
        function getCursorPos(e): any {
            let a, x = 0, y = 0;
            e = e || window.event;
            a = img.getBoundingClientRect();
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return { x, y };
        }
    }

    mouseout(): void {
        this.hide = true;
    }

    openSliderImageModal(template: TemplateRef<any>): void {
        this.modalRef2 = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-dialog-centered modal-lg' })
        );
    }

    closeSliderImageModal(): void {
        this.modalRef2.hide();
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
        if(this.selectedSuggestionProduct.length){
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
        else {
            this.selectedProduct = product;
            this.selectedProductQuantity = quantity;
            this.addToCart();
        }
    }

    closeProductSuggestionModal(): void {
        this.modalRef3.hide();
        this.addToCart();
    }

    // addToCartProduct(): void{
    //   console.log("selected Product",this.selectedProduct);
    //   this.cartService.addToCartProduct(this.selectedProduct).subscribe((response)=>{
    //       if(response.success) {
    //         this.authService.sucessMessage(response.message);
    //       }
    //       else {
    //         console.log(`Add to product cart ${response.message}`);
    //       }
    //   },(error)=>{
    //     console.log(`Add to product cart ${error}`);
    //   });
    // }

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
        this.commonApiService
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
                            //    if (findElement.maximum_quantity >= totalProduct) {
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

    openProductModal(data: any): void {
        if(this.suggestionProductList.length) {
            this.openProductSuggestionModal(data.product, data.quantity);
        }
        else {
            this.selectedProductQuantity =1;
            this.selectedProduct = data.product;
            this.addToCart();
        }
       // this.openProductSuggestionModal(data.product, data.quantity);
    }

    onReportFormSubmit(): void {
        this.reportFormSubmitted = true;
        if (this.reportForm.invalid) {
            return;
        }
        this.commonApiService.saveReport(this.reportForm.value).subscribe(response => {
            if (response.success) {
                this.modalRef.hide();
                this.authService.sucessMessage(response.message);
            }
            else {
                this.authService.errorMessage(response.message);
            }
        }, (error) => {
            console.log(`Save report api error : ${error}`);
        });
    }

    onSelectImage(image: string): void {
        this.selectedImage = image;
        this.openSliderImageModal(this.template2);
    }

    /* All variation related method */
    getPowerData(selectedValue, value, variationType, pwrId): void {
        if (variationType === 'power_option') {
            const findIndex = this.powerOptionList.findIndex(element => (value === element.level));
            (findIndex > -1) ? this.powerOptionList[findIndex].option = selectedValue :
                this.powerOptionList.push({ level: value, option: selectedValue });
            const powerOptions = [];
            this.powerOptionList.forEach((element) => {
                if (value >= element.level) {
                    powerOptions.push(element.option);
                }
            });
            const args = {
                product_id: this.productDetail.id,
                current: value,
                quantity: 1,
                power_options: powerOptions
            };
            this.commonApiService.getPowerData(args).subscribe((response) => {
                if (response.success) {
                    this.productOption.forEach((outerElement, outerIndex) => {
                        outerElement.forEach((innerElement, innerIndex) => {
                            if (innerElement.pwr_level === (value + 1)) {
                                this.productOption[outerIndex][innerIndex].option = response.data;
                            }
                        });
                    });
                    if (!Array.isArray(response.data)) {
                        this.pwrId = response.data.pwr_id;
                        this.totalProductComparePrice = response.data.price * this.productQuantity;
                        this.totalProductPrice = response.data.special * this.productQuantity;
                        this.singleProductComparePrice = response.data.price;
                        this.singleProductPrice = response.data.special;
                    }
                    let index = 0;
                    this.selectedPowerOption.forEach((outerElement, outerIndex) => {
                        outerElement.forEach((innerElement, innerIndex) => {
                            if (index > value && innerElement.variation_type === 'power_option') {
                                this.selectedPowerOption[outerIndex][innerIndex].value = '';
                            }
                            index++;
                        });
                    });
                }
                else {
                    console.log(`Get power data api error`);
                }
            }, (error) => {
                console.log(`Get power data api error ${error}`);
            });
        }
        else {
            if (!this.selectedStandardOption.includes(selectedValue)) {
                this.selectedStandardOption.push(selectedValue);
            }
            const args = {
                product_id: this.productDetail.id,
                pwr_id: this.pwrId,
                standard_options: [selectedValue],
                quantity: 1
            };
            this.commonApiService.updatePowerData(args).subscribe((response) => {
                if (response.success) {
                    if (!Array.isArray(response.data)) {
                        this.totalProductComparePrice = response.data.price * this.productQuantity;
                        this.totalProductPrice = response.data.special * this.productQuantity;
                        this.singleProductComparePrice = response.data.price;
                        this.singleProductPrice = response.data.special;
                    }
                }
            }, (error) => {
                console.log(`Get power data api error ${error}`);
            });
        }
        this.checkAllOptionSelected();
    }
}
