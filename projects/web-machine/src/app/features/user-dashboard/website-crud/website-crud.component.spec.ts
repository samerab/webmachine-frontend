import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteCrudComponent } from './website-crud.component';

describe('WebsiteCrudComponent', () => {
  let component: WebsiteCrudComponent;
  let fixture: ComponentFixture<WebsiteCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
