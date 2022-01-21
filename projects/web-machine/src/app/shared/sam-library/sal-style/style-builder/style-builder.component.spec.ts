import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleBuilderComponent } from './style-builder.component';

describe('StyleBuilderComponent', () => {
  let component: StyleBuilderComponent;
  let fixture: ComponentFixture<StyleBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StyleBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
