import { ClickedNavbarItem, MenuAcionNames, MenuItem } from './../models';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { NavbarItem } from '../models';
import { MenuService } from '../services/menu.service';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'sal-navbar',
  templateUrl: './sal-navbar.component.html',
  styleUrls: ['./sal-navbar.component.scss'],
})
export class SalNavbarComponent implements OnInit, AfterViewInit {

  @Input() startList: NavbarItem[];
  @Input() endList: NavbarItem[];
  @Input() color: string;
  @Output() onItemClick: EventEmitter<ClickedNavbarItem> = new EventEmitter<ClickedNavbarItem>();

  constructor(
    private menuSv: MenuService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    
  }

  runCommand(item: NavbarItem, event: MouseEvent) {
    if (item.action.name === MenuAcionNames.runLocalCommand) {
      this.onItemClick.emit({id: item.id, event});
      return;
    }
    this.menuSv.executeMenuAction(item.action);
  }

}
