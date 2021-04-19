import { CommonApisService } from './../../../shared/services/common-apis.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentResponseComponent } from './payment-response.component';
import { RouterTestingModule  } from '@angular/router/testing';
import { HttpClientTestingModule  } from '@angular/common/http/testing';

describe('PaymentResponseComponent', () => {
  let component: PaymentResponseComponent;
  let fixture: ComponentFixture<PaymentResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentResponseComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [CommonApisService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
