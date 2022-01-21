import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function isPositiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (isNaN(control.value) || control.value <= 0) {
            return {notPositiveNumber: {value: control.value}}
        }
        return null
    };
  }