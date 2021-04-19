import { OwlOptions } from 'ngx-owl-carousel-o';
import { Options, LabelType } from 'ng5-slider';
export const PaginationMaxSize = 10;
export const EmailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,15})+$/;
export const InterceptorSkipHeader = 'X-Skip-Interceptor';
export const CustomOptions: OwlOptions = {
  autoplay: false,
  loop: false,
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

export const SliderOptions: Options =  {
  floor: 0,
  ceil: 1000,
  translate: (value: number, label: LabelType): string => {
    return '€ ' + value;
  },
};

export class Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  warrantyYear: number;
  warrantyPrice: number;
  insuranceYear: number;
  insurancePrice: number;
  tags: Array<string>[];
  maxQuantity: number;
  option: any;
}

export class Item {
  product: Product;
  quantity: number;
}

export class Warranty {
  year: number;
  price: number;
}

export class Insurance {
  year: number;
  price: number;
}

