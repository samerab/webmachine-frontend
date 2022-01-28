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

  loadOne(entity: string, id: string, detach = false) {
    if (entity === 'users') {
      return this.httpClient.get(`${this.envSv.apiUrl}/users/${id}`);
    }
    return this.httpClient.get(this.genUrl(entity, id, detach));
  }

  loadAll(entity: string, detach = false) {
    return this.httpClient.get(this.genUrl(entity, null, detach));
  }

  loadMany(entity: string, detach = false) {
    return this.httpClient.get(this.genUrl(entity, 'loadMany', detach));
  }

  addOne(entity: string, payload: any, detach = false) {
    return this.httpClient.post(this.genUrl(entity, null, detach), payload);
  }

  addMany(entity: string, payload: any, detach = false) {
    return this.httpClient.post(this.genUrl(entity, null, detach), payload);
  }

  updateOne(entity: string, id: string, payload: any, detach = false) {
    return this.httpClient.put(this.genUrl(entity, id, detach), payload);
  }

  updateMany(
    entity: string,
    payload: { id: string; changes: any }[],
    detach = false
  ) {
    return this.httpClient.put(this.genUrl(entity, null, detach), payload);
  }

  deleteOne(entity: string, id: string, detach = false) {
    return this.httpClient.delete(this.genUrl(entity, id, detach));
  }

  deleteMany(entity: string, payload: any, detach = false) {
    return this.httpClient.put(this.genUrl(entity, 'delete', detach), payload);
  }

  get(path: string) {
    return this.httpClient.get(`${this.envSv.apiUrl}/${path}`);
  }

  post(path: string, body: any) {
    return this.httpClient.post(`${this.envSv.apiUrl}/${path}`, body);
  }

  // deleteAll(entityData: EntityData) {
  //   return this.httpClient.post(this.genUrl('deleteAll'), entityData);
  // }
}
