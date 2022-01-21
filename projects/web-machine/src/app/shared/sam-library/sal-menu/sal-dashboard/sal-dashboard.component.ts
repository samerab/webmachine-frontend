import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'sal-dashboard',
  templateUrl: './sal-dashboard.component.html',
  styleUrls: ['./sal-dashboard.component.scss']
})
export class SalDashboardComponent implements OnInit {

  @Input() list;
  @Input() sideBarClass: string;
  @Input() dashboardClass: string;

  mainSidebarIsVisible = true;

  @ViewChild('container', {static: true}) container: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.addClass();
  }
  
  addClass() {
    if (this.dashboardClass) {
      this.renderer.addClass(this.container.nativeElement, this.dashboardClass);
    }
  }

  hideSidebar() {
    this.mainSidebarIsVisible = false;
    this.renderer.addClass(this.container.nativeElement, 'hideMainSidebar');
  }

  showSidebar() {
    this.mainSidebarIsVisible = true;
    this.renderer.removeClass(this.container.nativeElement, 'hideMainSidebar');
  }

}
