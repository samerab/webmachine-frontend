import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {

constructor(private userSv: UserService) { }

bootstrap() {
  this.userSv.refreshUser()
}

}
