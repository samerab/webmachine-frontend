import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeout } from '@ws-sal';


@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit, AfterViewInit {

  @ViewChild('confirmMessage') confirmMessage: TemplateRef<any>;
  @ViewChild('success') success: TemplateRef<any>;
  @ViewChild('failure') failure: TemplateRef<any>;

  template: TemplateRef<any>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.setTemplate()
  }

  @timeout()
  setTemplate() {
    this.route.data.subscribe(data => {
      let tpl;
      switch (data['template']) {
        case 'confirmMessage':
          tpl = this.confirmMessage
          break;
        case 'success':
          tpl = this.success
          break;
        case 'failure':
          tpl = this.failure
          break;
        default:
          break;
      }
      this.template = tpl
    })
  }

}
