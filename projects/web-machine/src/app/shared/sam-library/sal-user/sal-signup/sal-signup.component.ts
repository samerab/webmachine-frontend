import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sal-signup',
  templateUrl: './sal-signup.component.html',
  styleUrls: ['./sal-signup.component.scss']
})
export class SalSignupComponent implements OnInit, OnDestroy {

  @Input() panelClass: string = '';
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  isEmailError = false;
  isPasswordError = false;
  sub: Subscription = new Subscription();


  constructor(private host: ElementRef, private renderer: Renderer2, private fb: FormBuilder) {
    this.form = this.genForm();
   }

  ngOnInit(): void {
     this.addPanelClass();
    this.observeErrors()
  }

  addPanelClass() {
    if (this.panelClass) {
       this.renderer.addClass(this.host.nativeElement, this.panelClass);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  observeErrors() {
    this.sub.add(this.form.valueChanges.subscribe(_ => this.setErrors()))
  }

  genForm() {
    return this.fb.group({
      email: ['', [Validators.email]],
      password: ''
    })
  }

  setErrors() {
    this.isEmailError = this.form?.get('email').hasError('email');
  }

  send() {
    this.setErrors();
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value)
    }
  }

}

