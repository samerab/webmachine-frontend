import { Component, OnInit } from '@angular/core';
import { LocalStoreService } from '../lacal-store-service/local-store.service';

@Component({
  selector: 'app-snack-message',
  templateUrl: './snack-message.component.html',
  styleUrls: ['./snack-message.component.scss']
})
export class SnackMessageComponent implements OnInit {

  message$;

  constructor(
    private store: LocalStoreService
    ) { 
    this.message$ = this.store.snackMsgSubject;
  }

  ngOnInit(): void {
  }

}