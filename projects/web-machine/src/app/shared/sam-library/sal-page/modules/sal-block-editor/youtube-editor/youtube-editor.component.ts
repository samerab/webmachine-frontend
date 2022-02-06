import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { BlockSettingsService } from '../block-settings.service';

@Component({
  selector: 'youtube-editor',
  templateUrl: './youtube-editor.component.html',
  styleUrls: ['./youtube-editor.component.scss'],
})
export class YoutubeEditorComponent implements OnInit {
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
    this.settingsSv
      .fetch()
      .pipe(take(1))
      .subscribe((settings) => {
        this.form.setValue(settings);
      });
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
