import { FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@ws-store/index';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { getAllPagesSlugs, getPageById } from '@ws-store/page/page.selectors';
import { addPage, updatePage } from '@ws-store/page/page.actions';
import { EnvService } from '../../../core/services/env/env.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { Page } from '@ws-sal';
import { firstWebsite } from '@ws-store/website/website.selectors';
import { Website } from '@ws-store/website/website.model';
import { setPreviewMode } from '@ws-store/common/common.actions';
import { getAllFiles } from '@ws-store/file/file.selectors';
import { addFiles } from '@ws-store/file/file.actions';

@Component({
  selector: 'ws-page-crud',
  templateUrl: './page-crud.component.html',
  styleUrls: ['./page-crud.component.scss'],
})
export class PageCrudComponent implements OnInit, OnDestroy {
  info$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  slug: FormControl = new FormControl('');
  modifiedPage: Page;
  slugs = [];
  status;
  isSlugChanged = false;
  currentWebsite: Website;
  sub: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private window: Window,
    private envSv: EnvService
  ) {
    this.setCurrentWebsite();
  }

  ngOnInit(): void {
    this.setStatus();
    this.setPagesSlugs();
    this.onSlugChange();
    this.page$.pipe(take(1)).subscribe((page) => {
      this.slug.setValue(page?.info?.slug, { emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get fileList$() {
    return this.store.pipe(select(getAllFiles));
  }

  onPreviewMode(status: boolean) {
    this.store.dispatch(setPreviewMode({ status }));
  }

  uploadFiles(files) {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
    this.store.dispatch(addFiles({ files: formData }));
  }

  onInfo(info) {
    this.info$.next(info);
  }

  private onSlugChange() {
    this.sub.add(
      this.slug.valueChanges.subscribe(() => (this.isSlugChanged = true))
    );
  }

  get page$() {
    return this.route.paramMap.pipe(
      take(1),
      switchMap((params) => {
        const pageId = params.get('id');
        this.status = pageId ? 'edit' : 'add';
        if (this.status === 'edit') {
          return this.store.pipe(take(1), select(getPageById(pageId)));
        }
        return of(null);
      })
    );
  }

  setStatus() {
    this.sub.add(
      this.route.url.subscribe((arr) => (this.status = arr[0].path))
    );
  }

  setPagesSlugs() {
    this.store
      .pipe(select(getAllPagesSlugs()))
      .pipe(take(1))
      .subscribe((slugs) => (this.slugs = slugs));
  }

  isSlugExist(slug: string) {
    return this.slugs.includes(slug);
  }

  getModifiedPage(page: Page, slug?: string) {
    slug = this.generateSlug(slug, page);
    const infoCopy = { ...page.info };
    infoCopy.slug = slug;
    const pageCopy = { ...page };
    pageCopy.info = { ...infoCopy };
    return { ...pageCopy };
  }

  private generateSlug(slug: string, page: Page) {
    if (!slug) {
      slug = page.info.slug;
    } else {
      slug = slug.replace(/ /g, '-');
    }
    let n = 1;
    while (this.isSlugExist(slug)) {
      if (n === 1) {
        slug = `${slug}-${n}`;
      } else {
        slug = `${slug.substr(0, slug.length - 2)}-${n}`;
      }
      n++;
    }
    return slug;
  }

  setCurrentWebsite() {
    this.sub.add(
      this.store.select(firstWebsite).subscribe((website) => {
        this.currentWebsite = website;
      })
    );
  }

  save(page) {
    if (this.status === 'add') {
      page = this.addPage(page);
    } else {
      page = this.editPage(page);
    }
    this.modifiedPage = page;
  }

  private editPage(page: any) {
    if (this.isSlugChanged) {
      page = { ...this.getModifiedPage(page, this.slug.value) };
      this.isSlugChanged = false;
    }
    const { id, ...changes } = page;
    const update = { id, changes };
    this.store.dispatch(updatePage({ page: update }));
    return page;
  }

  private addPage(page: any) {
    page = {
      ...this.getModifiedPage(page),
      websiteId: this.currentWebsite?.id,
    };
    this.store.dispatch(addPage({ page }));
    this.status = 'edit';
    this.slug.setValue(page?.info?.slug);
    return page;
  }

  onRealPreview(page: Page) {
    const slug = this.modifiedPage?.info?.slug;
    let mainDomain = this.envSv.mainDomain;
    if ((mainDomain = 'http://localhost:3000')) {
      mainDomain = 'http://localhost:4200';
    }
    const url = `${mainDomain}/page/${slug}`;
    this.window.open(url);
  }
}
