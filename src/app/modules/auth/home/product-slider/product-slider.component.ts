import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProductSliderComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  defualtImage = environment.DEFAULT_IMAGE_URL;
  @Input('bannerList') bannerList: any[] = [];
  productSlider: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 10,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };
  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.bannerList.forEach((element, index) => {
        if (
          new Date(element.start_date).getTime() < new Date().getTime() &&
          new Date(element.end_date).getTime() > new Date().getTime()
        ) {
          const startDate = new Date().getTime();
          const endDate = new Date(element.end_date).getTime();
          const distance = Math.abs(endDate - startDate);
          const days = Math.floor(distance / 86400000);
          const hours = Math.floor((distance % 86400000) / 3600000);
          const minutes = Math.floor((distance % 3600000) / 60000);
          const seconds = Math.floor((distance % 60000) / 1000);
          let time = '';
          time += (days !== 0) ? (days + ' dienų ') : '';
          time += (hours !== 0) ? (hours + ' hvalandos ') : '';
          time += (minutes !== 0) ? (minutes + ' minutes ') : '';
          time += (' ' + seconds + ' sekundes ');
          this.bannerList[index].time = time;
        }
      });
    }, 1000);
  }
}
