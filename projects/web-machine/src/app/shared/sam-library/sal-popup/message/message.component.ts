import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  //title = typeof this.data.title === 'undefined' ? 'error.error' : this.data.title;
  message = this.data.message;
  type = this.data.type;
  ok = this.data.buttonOkText;
  cancel = this.data.buttonCancelText
  
  constructor(
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit() {
  }

}
