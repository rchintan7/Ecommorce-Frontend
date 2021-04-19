import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-list-image-slider',
  templateUrl: './product-list-image-slider.component.html',
  styleUrls: ['./product-list-image-slider.component.scss']
})

export class ProductListImageSliderComponent implements OnInit {
  constructor() { }
  customOptions: OwlOptions = {
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
