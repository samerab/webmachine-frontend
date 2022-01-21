import { User } from './../../store/user/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env/env.service';

export interface EntityData {
  entity: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient, private envSv: EnvService) {}

  private genUrl(entityName: string, action?: string, detach?: boolean) {
    let path = `${this.envSv.apiUrl}/entity/${entityName}`;
    if (detach) {
      path = `${this.envSv.apiUrl}/${entityName}`;
    }
    if (!action) {
      return path;
    }
    return `${path}/${action}`;
  }

  loginUser(user: User) {
    return this.httpClient.post(`${this.envSv.apiUrl}/users/login`, user);
  }

  logoutUser() {
    return this.httpClient.get(`${this.envSv.apiUrl}/users/logout`);
  }

  signupUser(user: User) {
    return this.httpClient.post(`${this.envSv.apiUrl}/users/signup`, user);
  }

  loadAsset(name: string) {
    return this.httpClient.get(`${this.envSv.apiUrl}/assets/${name}`);
  }

  loadOne(entity: string, id: string) {
    if (entity === 'users') {
      return this.httpClient.get(`${this.envSv.apiUrl}/users/${id}`);
    }
    return this.httpClient.get(this.genUrl(entity, id));
  }

  loadAll(entity: string) {
    return this.httpClient.get(this.genUrl(entity));
  }

  loadMany(entity: string, payload: any, detach = false) {
    return this.httpClient.post(this.genUrl(entity, null, detach), payload);
  }

  addOne(entity: string, payload: any, detach = false) {
    return this.httpClient.post(this.genUrl(entity, null, detach), payload);
  }

  addMany(entity: string, payload: any) {
    return this.httpClient.post(this.genUrl(entity), payload);
  }

  updateOne(entity: string, id: string, payload: any) {
    return this.httpClient.put(this.genUrl(entity, id), payload);
  }

  updateMany(entity: string, payload: { id: string; changes: any }[]) {
    return this.httpClient.put(this.genUrl(entity), payload);
  }

  deleteOne(entity: string, id: string) {
    return this.httpClient.delete(this.genUrl(entity, id));
  }

  deleteMany(entity: string, payload: any) {
    return this.httpClient.put(this.genUrl(entity, 'delete'), payload);
  }

  // get(path: string) {
  //   return this.httpClient.get(`${this.envSv.apiUrl}/${path}`);
  // }

  // post(path: string, body: any) {
  //   return this.httpClient.post(`${this.envSv.apiUrl}/${path}`, body);
  // }

  // deleteAll(entityData: EntityData) {
  //   return this.httpClient.post(this.genUrl('deleteAll'), entityData);
  // }
}
