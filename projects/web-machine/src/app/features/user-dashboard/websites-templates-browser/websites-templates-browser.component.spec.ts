import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesTemplatesBrowserComponent } from './websites-templates-browser.component';

describe('WebsitesTemplatesBrowserComponent', () => {
  let component: WebsitesTemplatesBrowserComponent;
  let fixture: ComponentFixture<WebsitesTemplatesBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsitesTemplatesBrowserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsitesTemplatesBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
