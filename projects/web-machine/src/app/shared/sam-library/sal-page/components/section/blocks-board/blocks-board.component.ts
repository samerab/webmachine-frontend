import { PageService } from '../../../services/page.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlockTemplateInfo } from '../section-providers';

@Component({
  selector: 'ws-blocks-board',
  templateUrl: './blocks-board.component.html',
  styleUrls: ['./blocks-board.component.scss'],
})
export class BlocksBoardComponent {
  @Input() blockTemplateList: BlockTemplateInfo[];
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();

  _onSelect(blockName: string) {
    this.onSelect.emit(blockName);
  }
}
