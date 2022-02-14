ng g c features/website-dashboard/redirect --skip-tests --inline-style --inline-template --flat
ng g c features/page/img-browser --skip-tests
ng g c shared/sam-library/sal-btn/sal-group-btn --skip-tests
ng g c shared/sam-library/sal-style/styles-components/value-unit --skip-tests

ng g m shared/sam-library/sal-page/ --routing

# sal-block-editor

ng g m shared/sam-library/sal-page/modules/sal-block-editor/menu-bar-editor --routing
ng g c shared/sam-library/sal-page/modules/sal-block-editor/menu-bar-editor/menu-bar-editor --flat --skip-tests

# sal-block-template

ng g m shared/sam-library/sal-page/modules/sal-block-template/menu-bar-template
ng g c shared/sam-library/sal-page/modules/sal-block-template/menu-bar-template/menu-bar-template --flat --skip-tests

ng g s shared/sam-library/sal-page/components/section/section --skip-tests
ng g s shared/sam-library/sal-page/components/block/block --skip-tests

ng g d shared/sam-library/directives/selectionClass --flat --skip-tests

ng g m shared/sam-library/sal-page/modules/sal-block-template/block-navbar
ng g c shared/sam-library/sal-page/modules/sal-block-template/block-navbar/block-navbar --skip-tests

ng g m shared/sam-library/sal-page/modules/sal-block-template/gallery-template
ng g c shared/sam-library/sal-page/modules/sal-block-template/gallery-template/gallery-template --flat --skip-tests
