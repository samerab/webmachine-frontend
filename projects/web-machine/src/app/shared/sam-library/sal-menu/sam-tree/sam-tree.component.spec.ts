import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamTreeComponent } from './sam-tree.component';

describe('SamTreeComponent', () => {
  let component: SamTreeComponent;
  let fixture: ComponentFixture<SamTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
