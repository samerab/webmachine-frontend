/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IconBtnContentComponent } from './icon-btn-content.component';

describe('IconBtnContentComponent', () => {
  let component: IconBtnContentComponent;
  let fixture: ComponentFixture<IconBtnContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconBtnContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconBtnContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
