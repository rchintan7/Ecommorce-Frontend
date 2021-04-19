import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { RouterTestingModule  } from '@angular/router/testing';
import { HttpClientTestingModule  } from '@angular/common/http/testing';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule ],
      providers: [ CommonApisService]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
