import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SidebarItem } from '../models';

@Component({
  selector: 'sal-sidebar',
  templateUrl: './sal-sidebar.component.html',
  styleUrls: ['./sal-sidebar.component.scss']
})
export class SalSidebarComponent implements OnInit {

  @Input() list: SidebarItem[];
  @Input() sideBarClass: string;

  @ViewChild('sidebarContainer', {static: true}) sidebarContainer: ElementRef;
  
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.addClass();
  }
  
  addClass() {
    if (this.sideBarClass) {
      this.renderer.addClass(this.sidebarContainer.nativeElement, this.sideBarClass);
    }
  }

}
