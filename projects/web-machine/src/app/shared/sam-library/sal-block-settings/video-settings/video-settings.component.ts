import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsData } from '../../sal-page/page.model';
import { BlockSettingsService } from '../../sal-page/modules/sal-block-editor/block-settings.service';

@Component({
  selector: 'ws-video-settings',
  templateUrl: './video-settings.component.html',
  styleUrls: ['./video-settings.component.scss'],
})
export class VideoSettingsComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public settingsSv: BlockSettingsService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.setForm();
  }

  buildForm() {
    this.form = this.fb.group({
      src: '',
      allowFullScreen: true,
    });
  }

  setForm() {
    this.settingsSv.savedBlockSettings$.subscribe(
      (settingsData: SettingsData) => {
        this.form.setValue(settingsData.settings);
      }
    );
  }

  send() {
    const val = { ...this.form.value, src: this.getEmbedSrc() };
    this.settingsSv.send(val);
  }

  // to do : execute this instead >>> _url = _url.replace('watch?v=','embed/');

  getEmbedSrc() {
    const initialSrc = this.form.get('src').value as string;
    if (initialSrc.includes('https://www.youtube.com/watch?v=')) {
      const split = initialSrc.split('?v=');
      const youtubeId = split[1].split('&')[0];
      return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    } else if (initialSrc.includes('https://www.youtube.com/embed/')) {
      return initialSrc;
    }
    return null;
  }
}
