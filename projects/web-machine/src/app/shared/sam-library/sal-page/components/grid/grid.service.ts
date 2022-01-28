import { Injectable } from '@angular/core';
import { Section, GridSettings } from '../../page.model';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor() {}

  getPopulatedSectionList(sectionList: Section[], settings: GridSettings) {
    const length = settings.sectionsCount;
    if (!sectionList?.length) return [];
    if (sectionList.length === length) {
      return this.getSameSectionList(length, sectionList, settings);
    } else if (sectionList.length < length) {
      return this.getSameSectionListAndAddMissing(
        length,
        sectionList,
        settings
      );
    } else if (sectionList.length > length) {
      return this.getReallocatedSectionList(length, sectionList, settings);
    }
    return [];
  }

  private getSameSectionList(
    length: number,
    sectionList: Section[],
    settings: GridSettings
  ) {
    const sections = this.generateSections(length, sectionList, settings);
    return sections;
  }

  private getSameSectionListAndAddMissing(
    length: number,
    sectionList: Section[],
    settings: GridSettings
  ) {
    const sl = this.generateSections(sectionList.length, sectionList, settings);
    const missingSections = this.generateSections(
      length,
      [],
      settings,
      sectionList.length
    );
    const sections: Section[] = [...sl, ...missingSections];
    return sections;
  }

  private getReallocatedSectionList(
    length: number,
    sectionList: Section[],
    settings: GridSettings
  ) {
    const sl = this.generateSections(length, sectionList, settings);
    for (let index = length; index < sectionList.length; index++) {
      if (sectionList[index]?.blockList?.length && sl[length - 1]) {
        sl[length - 1].blockList = [
          ...sl[length - 1].blockList,
          ...sectionList[index].blockList,
        ];
      }
    }
    return sl;
  }

  private generateSections(
    length: number,
    sectionList: Section[],
    settings: GridSettings,
    indexToStart = 0
  ) {
    let hasCss = false;
    if (settings && settings.mergeInfoList && settings.mergeInfoList.length) {
      hasCss = true;
    }
    let sList: Section[] = [];
    for (let index = indexToStart; index < length; index++) {
      const section = {
        id: null,
        blockList: sectionList.length ? [...sectionList[index].blockList] : [],
        layout: hasCss ? settings?.mergeInfoList[index] : null,
        //layout: settings?.layout,
        styleList: sectionList[index]?.styleList,
        settings: {
          color: settings.color,
        },
      };
      sList.push(section);
    }
    return sList;
  }
}
