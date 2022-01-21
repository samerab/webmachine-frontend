import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignWindowComponent } from './sign-window.component';

describe('SignWindowComponent', () => {
  let component: SignWindowComponent;
  let fixture: ComponentFixture<SignWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
