import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthUserOrderComponent } from './auth-user-order.component';

describe('AuthUserOrderComponent', () => {
  let component: AuthUserOrderComponent;
  let fixture: ComponentFixture<AuthUserOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthUserOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthUserOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
