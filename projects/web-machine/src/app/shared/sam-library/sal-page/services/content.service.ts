import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FilesBrowser } from '../../sal-file/tokens';
import { Grid, Section, Block } from '../page.model';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  filesBrowser: FilesBrowser;
  fileBrowsertemplate: TemplateRef<any>;
  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  /**
   *
   * @param container
   * @param component
   * @param data
   * @param css
   */
  createComponent(
    container: ViewContainerRef,
    component: any,
    data?: Grid | Section | Block | any
  ) {
    let componentFactory = this.resolver.resolveComponentFactory(component);
    let componentRef = container.createComponent(componentFactory);
    let instance = <any>componentRef.instance;
    instance['data'] = data;
    return instance;
  }

  insertComponent(
    index: number,
    container: ViewContainerRef,
    component: any,
    data?: Grid | Section | Block,
    css?: Object
  ) {
    let componentFactory = this.resolver.resolveComponentFactory(component);
    let componentRef = componentFactory.create(this.injector);
    let instance = <any>componentRef.instance;
    instance['data'] = data;
    let view = componentRef.hostView;
    container.insert(view, index);
  }
}
