import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  rgbToHex(rgbColor) {
    const rgbArr = rgbColor.replace(/[^\d,]/g, '').split(',');
    let r = rgbArr[0].toString(16);
    let g = rgbArr[1].toString(16);
    let b = rgbArr[2].toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
    // const he = rgbArr.map(x => {
    //   const hex = x.toString(16)
    //   return hex.length === 1 ? "0" + hex : hex
    // }).join('')
    // return '#' + he
  }

  /**
 * range(9, 18); // [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
 */
  generateRange(start, end) {
    return Array(end - start + 1).fill(0).map((_, index) => start + index)
  }
}
