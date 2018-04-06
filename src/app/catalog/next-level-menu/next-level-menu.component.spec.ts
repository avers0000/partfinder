import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextLevelMenuComponent } from './next-level-menu.component';

describe('NextLevelMenuComponent', () => {
  let component: NextLevelMenuComponent;
  let fixture: ComponentFixture<NextLevelMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextLevelMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextLevelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
