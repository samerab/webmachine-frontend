import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export interface WebsiteTemplate {
  id: string;
  imgSrc: string
}

@Component({
  selector: 'ws-websites-templates-browser',
  templateUrl: './websites-templates-browser.component.html',
  styleUrls: ['./websites-templates-browser.component.scss']
})
export class WebsitesTemplatesBrowserComponent implements OnInit {

  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();
  
  websiteTemplateList:  WebsiteTemplate[] = [
    {id: '1', imgSrc: 'http://freehtmldesigns.com/wp-content/uploads/2017/10/Gaas-Soft.jpg'},
    {id: '2', imgSrc: 'https://colorlib.com/wp/wp-content/uploads/sites/2/featured_electrician-website-templates.jpg'},
    {id: '3', imgSrc: 'https://themefisher.com/wp-content/uploads/2018/10/biztrox-hugo-premium-theme.jpg'},
    {id: '4', imgSrc: 'http://freehtmldesigns.com/wp-content/uploads/2017/10/Gaas-Soft.jpg'},
    {id: '5', imgSrc: 'http://freehtmldesigns.com/wp-content/uploads/2017/10/Gaas-Soft.jpg'},
    {id: '6', imgSrc: 'http://freehtmldesigns.com/wp-content/uploads/2017/10/Gaas-Soft.jpg'},
    {id: '7', imgSrc: 'http://freehtmldesigns.com/wp-content/uploads/2017/10/Gaas-Soft.jpg'},
    {id: '8', imgSrc: 'http://freehtmldesigns.com/wp-content/uploads/2017/10/Gaas-Soft.jpg'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onTplSelect(id: string) {
    this.onSelect.emit(id)
  }

}
