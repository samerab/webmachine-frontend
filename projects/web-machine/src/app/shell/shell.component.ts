import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'ws-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  menuList = [
    {title: 'Home', link: '/'},
    {title: 'Plans', link: '/user/signup'}
  ]
  isSticky = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll') onScroll() {
    const verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
    this.isSticky = verticalOffset > 0 ? true : false;
  }

}
