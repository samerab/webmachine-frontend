import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Directive,
  ContentChild,
  ElementRef,
  AfterContentInit,
  Renderer2,
} from '@angular/core';
import { Observable } from 'rxjs';

@Directive({
  selector: '[signWindowCommand]',
})
export class SignWindowCommandDirective {
  constructor(private host: ElementRef, private renderer: Renderer2) {
    renderer.addClass(host.nativeElement, 'command');
  }
}

@Component({
  selector: 'ws-sign-window',
  templateUrl: './sign-window.component.html',
  styleUrls: ['./sign-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignWindowComponent implements OnInit, AfterContentInit {
  @Input() email$: Observable<string>;
  @Output() onLogin: EventEmitter<null> = new EventEmitter<null>();
  @Output() onLogout: EventEmitter<null> = new EventEmitter<null>();
  @Output() onSignup: EventEmitter<null> = new EventEmitter<null>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {}

  _onLogin() {
    this.onLogin.emit();
  }
  _onSignup() {
    this.onSignup.emit();
  }
  _onLogout() {
    this.onLogout.emit();
  }
}
