import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxOutletComponent } from './aux-outlet.component';

describe('AuxOutletComponent', () => {
  let component: AuxOutletComponent;
  let fixture: ComponentFixture<AuxOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
