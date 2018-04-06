import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListItemExtendedComponent } from './product-list-item-extended.component';

describe('ProductListItemExtendedComponent', () => {
  let component: ProductListItemExtendedComponent;
  let fixture: ComponentFixture<ProductListItemExtendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListItemExtendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListItemExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
