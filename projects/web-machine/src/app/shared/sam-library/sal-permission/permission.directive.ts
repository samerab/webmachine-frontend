import { PermissionService } from './permission.service';
import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { filter, take } from 'rxjs/operators';

@Directive({
  selector: '[samPermission]'
})
export class PermissionDirective {
  hasView: boolean;

  @Input() set samPermission(permission: string) {
    this.permissionSv.check(permission)
    .pipe(
      filter(result => result !== null),
      take(1)
    )
      .subscribe(hasPermission => {
        if (hasPermission && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (!hasPermission && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      })

  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionSv: PermissionService
  ) {

  }

}
