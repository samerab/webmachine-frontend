import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalLoginComponent } from './sal-login.component';

describe('SalLoginComponent', () => {
  let component: SalLoginComponent;
  let fixture: ComponentFixture<SalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
