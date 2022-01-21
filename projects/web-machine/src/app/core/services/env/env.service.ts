import { Injectable } from '@angular/core';

/**
 * this service will be populated by env.service.provider
 * don't change values here
 * changes will be made in this file: src/app/sam.env.js
 */
@Injectable({
  providedIn: 'root',
})
export class EnvService {
  public mainDomain = '';
  /** without protocol */
  public host = '';
  public apiUrl = '';
  public enableDebug = true;

  constructor() {}
}
