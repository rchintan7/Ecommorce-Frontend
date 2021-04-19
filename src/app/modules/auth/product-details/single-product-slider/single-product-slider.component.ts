import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-single-product-slider',
  templateUrl: './single-product-slider.component.html',
  styleUrls: ['./single-product-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingleProductSliderComponent implements OnInit {

  constructor() { }
  productSlider: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<img class="arrow-left" src="assets/images/company/back.svg" alt="">', '<img class="arrow-right" src="assets/images/company/next.svg" alt="">'],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: true
  };

  ngOnInit(): void {
  }

}
