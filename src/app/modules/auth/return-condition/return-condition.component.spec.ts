import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnConditionComponent } from './return-condition.component';

describe('ReturnConditionComponent', () => {
  let component: ReturnConditionComponent;
  let fixture: ComponentFixture<ReturnConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
