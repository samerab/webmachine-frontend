import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamToolbarComponent } from './sam-toolbar.component';

describe('SamToolbarComponent', () => {
  let component: SamToolbarComponent;
  let fixture: ComponentFixture<SamToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
