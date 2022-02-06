import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from '@ws-sal';

@Component({
  selector: 'ws-aux-outlet',
  templateUrl: './aux-outlet.component.html',
  styleUrls: ['./aux-outlet.component.scss'],
})
export class AuxOutletComponent implements OnInit {
  constructor(
    private router: Router,
    private pageSv: PageService,
    private renderer: Renderer2,
    private host: ElementRef
  ) {}

  ngOnInit(): void {}

  closeAuxOutlet() {
    this.router.navigate([
      {
        outlets: {
          style: null,
          blockSettings: null,
        },
      },
    ]);
    this.pageSv.closeAuxOutletSubject.next(null);
  }

  setFullscreen() {
    this.renderer.addClass(this.host.nativeElement, 'fullscreen');
  }
}
