import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsData } from '../../sal-page/page.model';
import { BlockSettingsService } from '../block-settings.service';

@Component({
  selector: 'ws-img-settings',
  templateUrl: './img-settings.component.html',
  styleUrls: ['./img-settings.component.scss']
})
export class ImgSettingsComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public settingsSv: BlockSettingsService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.setForm();
  }

  buildForm() {
    this.form = this.fb.group({
      src: '',
    });
  }

  setForm() {
    this.settingsSv.savedBlockSettings$
      .subscribe((settingsData: SettingsData) => {
        this.form.setValue(settingsData.settings);
      });
  }
}
