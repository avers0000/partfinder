import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthUserOrdersComponent } from './auth-user-orders.component';

describe('HistoryComponent', () => {
  let component: AuthUserOrdersComponent;
  let fixture: ComponentFixture<AuthUserOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthUserOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthUserOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
