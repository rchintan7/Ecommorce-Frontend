import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng5SliderModule } from 'ng5-slider';
import { RatingModule, RatingConfig } from 'ngx-bootstrap/rating';


import { HomeComponent } from './home/home.component';
import { CompanySliderComponent } from './home/company-slider/company-slider.component';
import { ProductSliderComponent } from './home/product-slider/product-slider.component';
import { ProductListComponent } from './product-list/product-list.component';
import { OrderComponent } from './order/order.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SingleProductSliderComponent } from './product-details/single-product-slider/single-product-slider.component';
import { MultipleProductSliderComponent } from './product-details/multiple-product-slider/multiple-product-slider.component';
import { ProductImageSliderComponent } from './product-details/multiple-product-slider/product-image-slider/product-image-slider.component';
import { OrderListComponent } from './order-list/order-list.component';
import { SettingsComponent } from './settings/settings.component';
import { ProductListImageSliderComponent } from './product-list/product-list-image-slider/product-list-image-slider.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { DeliveryInformationComponent } from './delivery-information/delivery-information.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ReturnConditionComponent } from './return-condition/return-condition.component';
import { NewsSubscriptionComponent } from './news-subscription/news-subscription.component';
import { VoucherComponent } from './voucher/voucher.component';
import { AffiliateProgramComponent } from './affiliate-program/affiliate-program.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { ContactusComponent } from './contactus/contactus.component';
import { CareerComponent } from './career/career.component';
import { TestingComponent } from './testing/testing.component';
import { LazyimgDirective } from './../../shared/directive/lazyimg.directive';
import { LazyLoadImageModule,LAZYLOAD_IMAGE_HOOKS,ScrollHooks } from 'ng-lazyload-image';
import { ZoomImageComponent } from './zoom-image/zoom-image.component';
@NgModule({
  declarations: [
    HomeComponent,
    CompanySliderComponent,
    ProductSliderComponent,
    ProductListComponent,
    OrderComponent,
    ProductDetailsComponent,
    SingleProductSliderComponent,
    MultipleProductSliderComponent,
    ProductImageSliderComponent,
    OrderListComponent,
    SettingsComponent,
    ProductListImageSliderComponent,
    SubCategoriesComponent,
    WishlistComponent,
    PrivacyPolicyComponent,
    AboutusComponent,
    DeliveryInformationComponent,
    PaymentMethodComponent,
    ReturnConditionComponent,
    NewsSubscriptionComponent,
    VoucherComponent,
    AffiliateProgramComponent,
    ManufacturerComponent,
    PaymentResponseComponent,
    ContactusComponent,
    CareerComponent,
    TestingComponent,
    LazyimgDirective,
    ZoomImageComponent    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CarouselModule,
    TabsModule.forRoot(),
    Ng5SliderModule,
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    LazyLoadImageModule
  ],
  exports: [LazyimgDirective],
  providers: [
    RatingConfig,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {}
