import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-multiple-product-slider',
  templateUrl: './multiple-product-slider.component.html',
  styleUrls: ['./multiple-product-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MultipleProductSliderComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('relatedProduct') relatedProduct: any[];
  @ViewChild('template3', { static: false }) template3;
  @Output() wishlist = new EventEmitter<any>();
  @Output() productsuggestionmodal = new EventEmitter<any>();
  maxRating = 5;
  isReadOnly = true;
  productSlider: OwlOptions = {
    autoplay: true,
    margin: 15,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: [
      '<img class="arrow-left" src="assets/images/company/back.svg" alt="">',
      '<img class="arrow-right" src="assets/images/company/next.svg" alt="">',
    ],
    responsive: {
      0: {
        items: 1,
      },
      700: {
        items: 3,
      },
      1000: {
        items: 4,
      },
      1300: {
        items: 5,
      },
    },
    nav: true,
  };
  constructor(
    private commonApisService: CommonApisService
  ) { }

  ngOnInit(): void { }

  openProductModal(product: any, quantity: number): void {
    this.productsuggestionmodal.emit({ product, quantity });
  }

  addToWishlist(
    isWishlistAdded: boolean,
    index: number,
    productId: number
  ): void {
    this.wishlist.emit({ isWishlistAdded, productId, relatedProduct: true });
    this.relatedProduct[index].isWishlistAdded = isWishlistAdded ? 0 : 1;
  }

  redirectToProductDetails(productSlug: string): void {
    this.commonApisService.redirectToProductDetails(productSlug);
  }
}
