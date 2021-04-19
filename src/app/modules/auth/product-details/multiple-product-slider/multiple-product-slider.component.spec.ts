import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleProductSliderComponent } from './multiple-product-slider.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('MultipleProductSliderComponent', () => {
  let component: MultipleProductSliderComponent;
  let fixture: ComponentFixture<MultipleProductSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleProductSliderComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleProductSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
