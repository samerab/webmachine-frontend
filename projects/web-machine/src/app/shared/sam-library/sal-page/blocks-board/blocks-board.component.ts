import { PageService } from './../services/page.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { BlockService } from '../block/block.service';


@Component({
  selector: 'ws-blocks-board',
  templateUrl: './blocks-board.component.html',
  styleUrls: ['./blocks-board.component.scss']
})
export class BlocksBoardComponent implements OnInit {

  @Input() data;
  @Output() onSelect: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private pageSv: PageService,
    public blockSv: BlockService
  ) { }

  ngOnInit(): void {
  }

  addBlock(blockName: string) {
    const block = {
      id: uuid(),
      component: blockName,
      settings: {
        //color: 'red'
      }
    };
    this.pageSv.addBlockSubject.next({
      sectionId: this.data.id,
      block
    })
    this.onSelect.emit();
  }

}
