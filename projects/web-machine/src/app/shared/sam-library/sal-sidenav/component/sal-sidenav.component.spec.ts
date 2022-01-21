import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalSidenavComponent } from './sal-sidenav.component';

describe('SalSidenavComponent', () => {
  let component: SalSidenavComponent;
  let fixture: ComponentFixture<SalSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
