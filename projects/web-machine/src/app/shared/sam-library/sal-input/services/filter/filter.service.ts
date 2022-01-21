import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  getFilteredList(sourceList: any[], searchKey: string, fieldsToSearchIn?: string[], lang?: string): any[] {
    if (!sourceList) return [];
    if (!searchKey || searchKey.trim() ==='') return sourceList;
    return sourceList.filter(item => {
      let searchTarget: string = this.getSearchTarget(item, fieldsToSearchIn, lang);
      return searchTarget.includes(searchKey.toString().toLowerCase());
    });
  }

  private getSearchTarget(item: any, fieldsToSearchIn: string[], lang: string) {
    if (!item) return '';
    let searchTarget: string = '';
    if (!fieldsToSearchIn) {
      fieldsToSearchIn = Object.keys(item);
    }
    for (const field of fieldsToSearchIn) {
      if (lang && typeof item[field] === 'object' && item[field].hasOwnProperty(lang)) {
        searchTarget += item[field][lang].toString().toLowerCase();
      }
      else {
        searchTarget += item[field].toString().toLowerCase();
      }
    }
    return searchTarget;
  }


}
