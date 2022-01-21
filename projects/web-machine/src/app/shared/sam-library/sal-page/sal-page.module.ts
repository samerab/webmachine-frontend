import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid/grid.component';
import { SectionComponent } from './section/section.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VideoComponent } from './blocks/video/video.component';
import { GridDesignComponent } from './grid/grid-design/grid-design.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import { BlocksBoardComponent } from './blocks-board/blocks-board.component';
import { ImgComponent } from './blocks/img/img.component';
import { BlockComponent } from './block/block.component';
import { GridCellComponent } from './grid/grid-design/grid-cell/grid-cell.component';
import { GridCellsComponent } from './grid/grid-design/grid-cells/grid-cells.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SamMenuModule } from '../sal-menu/menu.module';
import { SalDirectiveModule } from '../directives/sam-directive.module';
import { SalTranslateModule } from '../sal-translate/sal-translate.module';
import { PageComponent } from './page/page.component';
import { SalPipeModule } from '../pipes/sal-pipe.module';
import { ClassicGalleryComponent } from './blocks/classic-gallery/classic-gallery.component';
import { FixedGridDashboardComponent } from './fixed-grid-dashboard/fixed-grid-dashboard.component';
import { SalButtonModule } from '../sal-button/sal-button.module';
import { SalPageRoutingModule } from './sal-page-routing.module';
import { ClassicProductInfoComponent } from './blocks/classic-product-info/classic-product-info.component';
import { SalCommonModule } from '../sal-common/sal-common.module';
import { TextComponent } from './blocks/text/text.component';
import { ChangeNameComponent } from './change-name/change-name.component';

@NgModule({
  declarations: [
    PageComponent,
    GridComponent,
    SectionComponent,
    VideoComponent,
    GridDesignComponent,
    BlocksBoardComponent,
    ImgComponent,
    BlockComponent,
    GridCellComponent,
    GridCellsComponent,
    ClassicGalleryComponent,
    FixedGridDashboardComponent,
    ClassicProductInfoComponent,
    TextComponent,
    ChangeNameComponent
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
    SalCommonModule
  ],
  exports: [
    PageComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SalPageModule { }
