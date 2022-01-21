import { FilterService } from './../services/filter/filter.service';
import { PopupService } from './../../sal-popup/popup-service/popup.service';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SmartInputComponent } from '../smart-input/smart-input.component';

@Component({
  selector: 'sal-popup-input',
  templateUrl: './popup-input.component.html',
  styleUrls: ['./popup-input.component.scss']
})
export class PopupInputComponent implements OnInit {

  @Input() label: string;
  @Input() lang: string;
  @Input() list: any[];
  @Input() displayedKey: string;

  @ViewChild('table') tableTemplate: TemplateRef<any>;
  @ViewChild(SmartInputComponent) input: SmartInputComponent;

  selectedItem;
  
  constructor(
    private popupSv: PopupService,
    private filterSv: FilterService
  ) { }

  ngOnInit(): void {
  }

  openPopup(searchKey: string) {
    const filteredList = this.filterSv.getFilteredList(this.list,searchKey)
    this.popupSv.openPopup(this.tableTemplate, filteredList)
    .subscribe(_ => {
      if (!this.selectedItem) {
        this.input.item = null;
      }
    })
  }

  onSelect(selectedItem): void {
    this.selectedItem = selectedItem;
    this.input.item = selectedItem;
    this.popupSv.closeAll()
    //this.setDataForUnit(index);
    //this.moveFocusing()
  }

}
