import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from './menu/menu.component';
import { SamToolbarComponent } from './sam-toolbar/sam-toolbar.component';
import { SamTreeComponent } from './sam-tree/sam-tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SalDirectiveModule } from '../directives/sam-directive.module';
import { SalNavbarComponent } from './sal-navbar/sal-navbar.component';
import { SalTranslateModule } from '../sal-translate/sal-translate.module';
import { RouterModule } from '@angular/router';
import { SalPermissionModule } from '../sal-permission/sal-permission.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    MenuItemComponent,
    MenuComponent,
    SamToolbarComponent,
    SamTreeComponent,
    SalNavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CdkTreeModule,
    DragDropModule,
    SalDirectiveModule,
    SalTranslateModule,
    SalPermissionModule,
    MatTooltipModule,
  ],
  exports: [
    MenuItemComponent,
    MenuComponent,
    SamToolbarComponent,
    SamTreeComponent,
    SalNavbarComponent,
  ],
})
export class SamMenuModule {}
