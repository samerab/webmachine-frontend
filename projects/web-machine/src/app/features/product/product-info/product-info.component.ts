import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ws-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.form.valueChanges.subscribe(x => console.log(x))
  }

  buildForm() {
    this.form = this.fb.group({
      title: '',
      description: '',
      variantList: this.fb.array([]),
    });
  }

}
