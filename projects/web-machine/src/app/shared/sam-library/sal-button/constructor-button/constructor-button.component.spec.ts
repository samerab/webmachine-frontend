import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorButtonComponent } from './constructor-button.component';

describe('ConstructorButtonComponent', () => {
  let component: ConstructorButtonComponent;
  let fixture: ComponentFixture<ConstructorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructorButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
