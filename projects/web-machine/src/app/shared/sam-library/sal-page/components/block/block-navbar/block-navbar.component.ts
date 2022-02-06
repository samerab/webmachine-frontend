import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockService } from '../block.service';

@Component({
  selector: 'block-navbar',
  templateUrl: './block-navbar.component.html',
  styleUrls: ['./block-navbar.component.scss'],
})
export class BlockNavbarComponent implements OnInit {
  @Output() onStyle: EventEmitter<null> = new EventEmitter<null>();
  @Output() onSettings: EventEmitter<null> = new EventEmitter<null>();
  @Output() onDelete: EventEmitter<null> = new EventEmitter<null>();

  constructor(private blockSv: BlockService) {}

  ngOnInit(): void {}

  _onStyle() {
    this.onStyle.emit();
  }
  _onSettings() {
    this.onSettings.emit();
  }
  _onDelete() {
    this.onDelete.emit();
  }
}
