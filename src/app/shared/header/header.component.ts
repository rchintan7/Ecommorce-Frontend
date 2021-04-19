import { Component,OnInit,Inject,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  HostListener,
  ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonApisService } from '../services/common-apis.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { EmailPattern } from '../models/constants';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnInit {
  // tslint:disable-next-line: indent
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  questionForm: FormGroup;
  status = false;
  submitted = false;
  isUserLogeedIn = false;
  totalQuantity = 0;
  totalProductPrice = 0;
  items: any[] = [];
  categories: any[] = [];
  quantitySubscription: Subscription;
  contactFormSubscription: Subscription;
  category = '0';
  search = '';
  username = '';
  successMessage = '';
  errorMessage = '';
  currentUrl = '';
  title = '';
  categorySection = [];
  isShowMoreCategory = true;
  @ViewChild('template') template;
  searchProductList = [];
  searchCategoryList = [];
  isGetResponse = true;
  showCategory = true;
  @ViewChild('searchSection') searchSection: ElementRef;
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if (!this.searchSection.nativeElement.contains(event.target)) {
      this.searchProductList = [];
      this.searchCategoryList = [];
    }
  }
  constructor(
    private modalService: BsModalService,
    private commonApisService: CommonApisService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.activatedRoute.queryParams.subscribe(
      (params: { categoryId: string; search: string }) => {
        if (params.categoryId) {
          this.category = params.categoryId;
        }
        if (params.search) {
          this.search = params.search;
        }
      }
    );
  }

  ngOnInit(): void {
    this.questionForm = this.formBuilder.group({
      topic: ['', Validators.required],
      message: ['', Validators.required],
      orderNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]],
      phone: ['', Validators.required],
    });
    this.commonApisService.fetchCategorySettings().subscribe(
      (response) => {
        if (response.success) {
          //this.categories = response.data.category;
          this.categorySection = response.data.category_data;
          this.title = response.data.title;
        }
      },
      (error) => {
        console.log('api failed of categories', error);
      }
    );
    this.username = this.authService.getUserName();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (this.authService.isLoggedIn()) {
          this.username = this.authService.getUserName();
          this.isUserLogeedIn = true;
        }
        this.currentUrl = this.router.url;
      }
    });
    this.quantitySubscription = this.cartService.quantitySubscription.subscribe(
      (response) => {
        this.totalQuantity = response;
        this.getCartItem();
      }
    );
    this.contactFormSubscription = this.authService.contactFormSubscription.subscribe(
      (response) => {
        this.openModal(this.template);
      }
    );
    this.totalQuantity = this.cartService.getTotalProduct();
    this.getCartItem();
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  }

  openModal2(template: TemplateRef<any>): void {
    this.modalRef2 = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
  }

  closeModal(modal): void {
    modal.hide();
    this.successMessage = '';
    this.errorMessage = '';
  }

  cartAreaOpen(): void {
    this.status = !this.status;
  }

  menuIcon(): void {
    this.document.body.classList.toggle('menu-open');
  }

  logOut(): void {
    this.authService.logout();
    this.isUserLogeedIn = false;
  }

  getCartItem(): void {
    this.cartService.loadCart();
    this.items = this.cartService.getCartItem();
    this.totalProductPrice = 0;
    this.items.forEach((element) => {
      this.totalProductPrice += element.product.price * element.quantity;
    });
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
    this.cartService.quantityRemove();
  }

  decimalNumber(price: number): string {
    return this.cartService.decimalNumber(price);
  }

  searchProduct($event): void {
    if ($event.keyCode !== 13) {
      if (this.isGetResponse) {
        this.isGetResponse = false;
        this.commonApisService.searchProduct({ category: this.category, search: this.search }).subscribe(
          (response) => {
            this.searchProductList = [];
            this.searchCategoryList = [];
            if (response.success) {
              this.searchProductList = response.data.products;
              this.searchCategoryList = response.data.sub_category;
            }
            this.isGetResponse = true;
          },
          (error) => {
            this.isGetResponse = true;
            console.log(`Search Product Api Error ${error}`);
          }
        );
      }
    } else {
      this.searchMoreProduct();
    }
  }


  searchMoreProduct(): void {
    this.searchProductList = [];
    this.searchCategoryList = [];
    this.router.navigateByUrl(
      'paieska?categoryId=' + this.category + '&search=' + this.search
    );
    //const url = this.router.serializeUrl(this.router.createUrlTree(['/paieska'],{queryParams:{'categoryId':this.category,'search':this.search}}));
    //window.open(url,'_blank');
  }

  redirectToOrder(modal): void {
    modal.hide();
    if (this.authService.isLoggedIn()) {
      this.commonApisService.redirectToOrderList();
    } else {
      this.commonApisService.redirectToLogin();
    }
  }

  submitQuestion(): boolean {
    this.submitted = true;
    if (this.questionForm.invalid) {
      return false;
    }
    this.commonApisService.saveQuestion(this.questionForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.submitted = false;
          this.questionForm.reset();
          this.successMessage = response.message;
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        this.errorMessage = 'Kažkas ne taip, bandykite dar kartą vėliau ...';
        console.log(`Submit Question Api Error ${error}`);
      }
    );
  }

  showMore(categorySlug: string): void {
    this.searchProductList = [];
    this.searchCategoryList = [];
    this.commonApisService.redirectToCategory(categorySlug);
  }

  redirectToSubCategory(selectedCategory: any): void {
    this.searchProductList = [];
    this.searchCategoryList = [];
    
    console.log("Selected Category",selectedCategory);
    if(selectedCategory.is_parent_category) {
      this.commonApisService.redirectToCategory(selectedCategory.slug);
    }  
    else {
      this.commonApisService.redirectToProductList(0, selectedCategory.id);
    }
  }

  redirectToProductList(categoryId: number, subCategoryId: number): void {
    this.commonApisService.redirectToProductList(categoryId, subCategoryId);
  }

  redirectToProductDetails(productSlug: string): void {
    this.searchProductList = [];
    this.searchCategoryList = [];
    this.commonApisService.redirectToProductDetails(productSlug);
  }

  redirectTo(value: any): void {
    if (value.children.length) {
      this.showMore(value.slug);
    }
    else {
      this.redirectToProductList(value.category_id, value.id);
    }
  }

  redirectToWishlist(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('wishlist');
    }
  }

  generatePdf(): void {
    const items = this.cartService.getCartItem();
    const data = [
      ['Prekė', 'Garantija', 'Kaina', 'Kiekis', 'Viso mokėti', 'Veiksmas'],
    ];
    let totalAmount = 0;
    let quantity = 0;
    items.forEach((element) => {
      data.push([
        element.product.name,
        element.product.warrantyYear,
        Number(element.product.price + element.product.warrantyPrice).toFixed(
          2
        ),
        element.quantity,
        Number(
          (element.product.price + element.product.warrantyPrice) *
          element.quantity
        ).toFixed(2),
        'Geriausia kaina',
      ]);
      quantity += element.quantity;
      totalAmount += Number(
        (element.product.price + element.product.warrantyPrice) *
        element.quantity
      );
    });
    data.push([
      '',
      '',
      '',
      quantity.toString(),
      Number(totalAmount).toFixed(2),
      '',
    ]);
    const documentDefinition = {
      content: [
        { text: 'Krepšelis', style: 'header' },
        {
          style: 'tableExample',
          table: {
            widths: [100, 50, 75, 50, 100, 100],
            body: data,
          },
        },
      ],
      styles: {
        header: {
          alignment: 'center',
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          alignment: 'center',
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          alignment: 'center',
          margin: [0, 5, 0, 15],
          width: '100%',
        },
        tableHeader: {
          alignment: 'center',
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };
    pdfMake.createPdf(documentDefinition).download('cart.pdf');
  }

  showMoreCategory(): void {
    this.isShowMoreCategory = !this.isShowMoreCategory;
  }

  showCategorySlideBar(){
    console.log("showCategory",this.showCategory);
    this.showCategory  = !this.showCategory;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.quantitySubscription.unsubscribe();
    this.contactFormSubscription.unsubscribe();
  }
}
