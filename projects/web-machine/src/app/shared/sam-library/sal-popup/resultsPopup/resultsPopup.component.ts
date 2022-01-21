import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'sal-results-popup',
  templateUrl: './resultsPopup.component.html',
  styleUrls: ['./resultsPopup.component.scss']
})
export class ResultsPopupComponent implements OnInit {

  template: TemplateRef<any>;
  context;
    
  constructor(
    public dialogRef: MatDialogRef<ResultsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.template = data.template;
    this.context = data.context;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
