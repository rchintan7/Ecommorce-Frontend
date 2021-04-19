import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-company-slider',
  templateUrl: './company-slider.component.html',
  styleUrls: ['./company-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanySliderComponent implements OnInit {

  @Input('companyLogos') companyLogos: any[] = [];
  defualtImage = environment.DEFAULT_IMAGE_URL;
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
        items: 3
      },
      600: {
        items: 4
      },
      960: {
        items: 4
      },
      1200: {
        items: 5
      }
    },
    nav: true
  };
  constructor() { }
  ngOnInit(): void {

  }
}
