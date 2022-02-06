import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { SectionComponent } from './components/section/section.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GridDesignComponent } from './components/grid/grid-design/grid-design.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { BlocksBoardComponent } from './components/section/blocks-board/blocks-board.component';
import { BlockComponent } from './components/block/block.component';
import { GridCellComponent } from './components/grid/grid-design/grid-cell/grid-cell.component';
import { GridCellsComponent } from './components/grid/grid-design/grid-cells/grid-cells.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SamMenuModule } from '../sal-menu/menu.module';
import { SalDirectiveModule } from '../directives/sam-directive.module';
import { SalTranslateModule } from '../sal-translate/sal-translate.module';
import { PageComponent } from './components/page/page.component';
import { SalPipeModule } from '../pipes/sal-pipe.module';
import { FixedGridDashboardComponent } from './fixed-grid-dashboard/fixed-grid-dashboard.component';
import { SalButtonModule } from '../sal-button/sal-button.module';
import { SalPageRoutingModule } from './sal-page-routing.module';
import { SalCommonModule } from '../sal-common/sal-common.module';
import { ChangeNameComponent } from './components/change-name/change-name.component';
import { SalSidebarModule } from '../sal-sidebar/sal-sidebar.module';
import { SalContextMenuModule } from '../sal-context-menu/sal-context-menu.module';
import { SalSpinnerModule } from '../sal-spinner/sal-spinner.module';
import { SalIconModule } from '../sal-icon/sal-icon.module';
import { BlockNavbarComponent } from './components/block/block-navbar/block-navbar.component';
import { BlockInfoPipe } from './components/block/block-info.pipe';

@NgModule({
  declarations: [
    PageComponent,
    GridComponent,
    SectionComponent,
    GridDesignComponent,
    BlocksBoardComponent,
    BlockComponent,
    GridCellComponent,
    GridCellsComponent,
    FixedGridDashboardComponent,
    ChangeNameComponent,
    BlockNavbarComponent,
    BlockInfoPipe,
  ],
  imports: [
    CommonModule,
    SalPageRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SamMenuModule,
    SalDirectiveModule,
    SalTranslateModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatExpansionModule,
    DragDropModule,
    MatDialogModule,
    SalPipeModule,
    SalButtonModule,
    SalCommonModule,
    SalSidebarModule,
    SalContextMenuModule,
    SalSpinnerModule,
    SalIconModule,
  ],
  exports: [PageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalPageModule {}
