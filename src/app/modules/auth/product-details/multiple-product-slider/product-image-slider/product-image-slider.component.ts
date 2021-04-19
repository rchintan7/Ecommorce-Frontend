import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-image-slider',
  templateUrl: './product-image-slider.component.html',
  styleUrls: ['./product-image-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProductImageSliderComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('sliderImage') sliderImage;
  constructor(
    private commonApisService: CommonApisService
  ) {}
  customOptions: OwlOptions = {
    autoplay: true,
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
    },
    nav: true,
  };

  ngOnInit(): void {}

  redirectToProductDetails(productSlug: string): void {
    this.commonApisService.redirectToProductDetails(productSlug);
  }
}
