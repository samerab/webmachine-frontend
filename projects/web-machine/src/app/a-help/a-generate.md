ng g c features/website-dashboard/redirect --skip-tests --inline-style --inline-template --flat

ng g m shared/sam-library/sal-page --routing

# sal-block-editor

ng g m shared/sam-library/sal-page/modules/sal-block-editor/youtube --routing
ng g c shared/sam-library/sal-page/modules/sal-block-editor/gallery/gallery --flat --skip-tests

# sal-block-template

ng g m shared/sam-library/sal-page/modules/sal-block-template/youtube
ng g c shared/sam-library/sal-page/modules/sal-block-template/youtube/youtube --flat --skip-tests

ng g s shared/sam-library/sal-page/components/section/section --skip-tests

ng g d shared/sam-library/directives/selectionClass --flat --skip-tests
