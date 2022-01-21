import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl
} from '@angular/forms';
import { Subscription, fromEvent, Observable } from 'rxjs';
import { pluck, filter, take } from 'rxjs/operators';
import { ElementFocus } from '../models';

interface Item {
  currentItem: any;
  viewedValue: string;
}

@Component({
  selector: 'sal-smart-input',
  templateUrl: './smart-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SmartInputComponent),
      multi: true
    }
  ],
  styleUrls: ['./smart-input.component.scss']
})
export class SmartInputComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, ElementFocus {


  @Input() label: string;
  @Input() lang: string;
  @Input() tabIndex: number;
  @Input() set canShrank(val) {
    this._canShrank = val;
    this.inputIsHidden = val ? true : false;
  };
  @Input() displayedKey: string;
  
  @Output() enterClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocus: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  inputFormControl: FormControl = new FormControl();
  inputIsHidden = false;
  private subs = new Subscription();
  private _item: Item;
  private _canShrank;
  get canShrank() {
    return this._canShrank;
  }


  onChange: Function;
  onTouched: Function;
  enter$: Observable<any>;
  blur$: Observable<any>;

  constructor() {
    this.onChange = (_: any) => { };
    this.onTouched = () => { };
    this.canShrank = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.setObservables();
    this.subscribeToBlur();
    this.subscribeToEnter();
    this.subscribeToTouch();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  reset() {
    this.letInputVisible();
    this.inputFormControl.reset();
  }

  focusAndSelectContent() {
    this.input.nativeElement.focus()
    this.input.nativeElement.select()
  }

  public get item() {
    return this._item;
  }

  public set item(val: any) {
    this._item = val;
    this.onChange(val);
    this.setDisplayedValue(val);
  }

  getTranslationForDisplayedKey(obj) {
    if (!obj || !this.displayedKey) return '';
    if (this.lang && typeof obj === 'object') {
      if (obj[this.displayedKey].hasOwnProperty(this.lang)) {
        return obj[this.displayedKey][this.lang];
      }
      return obj[this.displayedKey];
    }
    else {
      return obj[this.displayedKey];
    }
  }

  onFocusEvent() {
    this.onFocus.emit(this.tabIndex)
  }

  private setObservables() {
    this.enter$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        filter((e: KeyboardEvent) => e.code === 'Enter'),
        pluck('target', 'value'),
      );

    this.blur$ = fromEvent(this.input.nativeElement, 'blur')
      .pipe(
        pluck('target', 'value')
      );
  }

  expandInput() {
    this.inputIsHidden = false;
    setTimeout(() => {
      this.focusAndSelectContent();
    }, 0);

  }

  send() {
    this.enterClick.emit(this.inputFormControl.value);
  }

  triggerEnter() {
    this.letInputVisible();
    if (this.input) {
      const e = new KeyboardEvent('keyup', { code: 'Enter' });
      e.initEvent('keyup', false, true);
      this.input.nativeElement.dispatchEvent(e);
    }
  }

  private letInputVisible() {
    if (this.canShrank) {
      this.inputIsHidden = false;
    }
  }

  hideInput() {
    this.inputIsHidden = true;
  }

  private subscribeToTouch() {
    this.subs.add(
      fromEvent(this.input.nativeElement, 'focus')
        .pipe(
          take(1)
        )
        .subscribe(() => {
          this.setTouch();
        })
    );
  }

  private subscribeToBlur() {
    this.subs.add(
      this.blur$
        .subscribe(_ => {
          this.onBlur.emit()
        })
    );
  }

  private subscribeToEnter() {
    this.subs.add(
      this.enter$
        .subscribe(() => {
          this.send();
        })
    );
  }

  private setDisplayedValue(obj: any) {
    const val = this.getTranslationForDisplayedKey(obj);
    this.inputFormControl.setValue(val);
  }

  setTouch() {
    this.onTouched();
  }

  writeValue(obj: any): void {
    this.setDisplayedValue(obj);
    this.item = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void { }


}
