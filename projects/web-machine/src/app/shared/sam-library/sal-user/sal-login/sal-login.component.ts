import { Component, OnInit, Input, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'sal-login',
  templateUrl: './sal-login.component.html',
  styleUrls: ['./sal-login.component.scss']
})
export class SalLoginComponent implements OnInit {

  @Input() panelClass: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSignup: EventEmitter<any> = new EventEmitter<any>();
  @Output() onForgot: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  constructor(private host: ElementRef, private renderer: Renderer2, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.renderer.addClass(this.host.nativeElement, this.panelClass);
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email: '',
      password: ''
    })
  }

  send() {
      this.onSubmit.emit(this.form.value)
  }

  newAccount() {
    this.onSignup.emit()
  }

  newPassword() {
    this.onForgot.emit()
  }

}
