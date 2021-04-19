import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListImageSliderComponent } from './product-list-image-slider.component';

describe('ProductListImageSliderComponent', () => {
  let component: ProductListImageSliderComponent;
  let fixture: ComponentFixture<ProductListImageSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListImageSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListImageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
