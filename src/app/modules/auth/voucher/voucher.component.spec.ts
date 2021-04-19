
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherComponent } from './voucher.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule } from '@angular/common/http/testing';
import {CommonApisService} from 'src/app/shared/services/common-apis.service';
import {ToastrService} from 'ngx-toastr';
import {RouterTestingModule} from '@angular/router/testing';
describe('VoucherComponent', () => {
  let component: VoucherComponent;
  let fixture: ComponentFixture<VoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [CommonApisService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
