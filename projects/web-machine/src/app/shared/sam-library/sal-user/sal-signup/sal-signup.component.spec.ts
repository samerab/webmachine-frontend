import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalSignupComponent } from './sal-signup.component';

describe('SalSignupComponent', () => {
  let component: SalSignupComponent;
  let fixture: ComponentFixture<SalSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
