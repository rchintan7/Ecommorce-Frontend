import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSubscriptionComponent } from './news-subscription.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

describe('NewsSubscriptionComponent', () => {
  let component: NewsSubscriptionComponent;
  let fixture: ComponentFixture<NewsSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSubscriptionComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ToastrService, AuthService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
