import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubCategoriesComponent implements OnInit {
  categories: any[] = [];
  subCategories: any[] = [];
  categoryDetails: any = {};
  categorySlug: string;
  subCategorySlug: string;
  loading:boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private commonApisService: CommonApisService,
  ) {
    this.activatedRoute.params.subscribe((params: { categorySlug: string }) => {
      this.fetchSubCategoriesById(params.categorySlug);
      this.categorySlug = params.categorySlug;
    });
  }

  ngOnInit(): void {}

  fetchSubCategoriesById(categorySlug): void {
    this.loading = true;
    this.commonApisService.fetchSubCategoriesById(categorySlug).subscribe(
      (response) => {
        this.loading = false;
        if (response.success) {
          this.categoryDetails = response.data.category;
          this.subCategories = response.data.subCategory;
        }
      },
      (error) => {
        this.loading = false;
        console.log(`Sub Category Api Error ${error}`);
      }
    );
  }

  redirectToProductList(subCategory): void {
    if (subCategory.is_parent_category === 0) {
      this.commonApisService.redirectToProductList(0, subCategory.id);
    } else {
      this.showMore(subCategory.slug);
    }
  }

  showMore(categorySlug: string): void {
    this.commonApisService.redirectToCategory(categorySlug);
  }
}
