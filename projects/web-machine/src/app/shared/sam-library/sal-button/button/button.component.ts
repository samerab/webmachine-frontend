import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';

interface ButtonData {
  label?: string;
  icon?: string;
  color?: string;
}

export interface ButtonConfig {
  buttonList: ButtonData[];
  gridTemplateColumns?: string;
  gap?: string;
  height?: string;
  type?: string;
  primaryDisabled?: boolean;
}


@Component({
  selector: 'sal-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class SalButtonComponent implements OnInit {

  _config;
  
  @Input() set config(val: ButtonConfig) {
    this._config = {...this._config, ...val};
  } 

  get config() {
    return this._config;
  }
  @Output() onClick: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private host: ElementRef,
    private renderer: Renderer2
  ) { 
    this.setDefaults();
  }

  ngOnInit(): void {
    this.setStyle();
  }

  setDefaults() {
    this.config = {
      buttonList: [{label: 'button'}]
    };
    this.config.gap = '4px';
    this.config.height = '40px';
    this.config.type = "raised";
  }


  private setStyle() {
    this.renderer.setStyle(this.host.nativeElement, 'display', 'grid');
    this.renderer.setStyle(this.host.nativeElement, 'grid-template-columns', this.generateGridColumns());
    this.renderer.setStyle(this.host.nativeElement, 'grid-gap', this.config.gap);
    this.renderer.setStyle(this.host.nativeElement, 'height', this.config.height);
  }

  private generateGridColumns() {
    if (this.config && !this.config.gridTemplateColumns) {
      let frs = '';
      for (const btn of this.config.buttonList) {
        frs = frs + ' 1fr';
      }
      frs = frs.slice(1);
      return frs;
    }
    return this.config.gridTemplateColumns;
  }

  onClickHandler(btnLabel: string) {
    this.onClick.emit(btnLabel);
  }

}
