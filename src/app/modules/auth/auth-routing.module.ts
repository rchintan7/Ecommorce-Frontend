import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { OrderComponent } from './order/order.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OrderListComponent } from './order-list/order-list.component';
import { SettingsComponent } from './settings/settings.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'paieska', component: ProductListComponent },
  { path: 'atsiskaitymas', component: OrderComponent },
  { path: 'product-details/:productSlug', component: ProductDetailsComponent },
  { path: 'order-list', component: OrderListComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'category/:categorySlug', component: SubCategoriesComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'privatumo-politika-35', component: PrivacyPolicyComponent },
  { path: 'apie-mus-4', component: AboutusComponent },
  { path: 'pristatymo-informacija-6', component: DeliveryInformationComponent },
  { path: 'atsiskaitymo-budai-3', component: PaymentMethodComponent },
  { path: 'prekiu-grAzinimo-sAlygos-5', component: ReturnConditionComponent },
  { path: 'naujienlaiskiai', component: NewsSubscriptionComponent },
  { path: 'voucher', component: VoucherComponent },
  { path: 'affiliate-login', component: AffiliateProgramComponent },
  { path: 'gamintojai', component: ManufacturerComponent },
  { path: 'payment-response', component: PaymentResponseComponent },
  { path: 'kontaktai', component: ContactusComponent },
  { path: 'karjera', component: CareerComponent }
];

export const AuthRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
