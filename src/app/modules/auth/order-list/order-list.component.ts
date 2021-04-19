import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { PaginationMaxSize } from 'src/app/shared/models/constants';
@Component({
	selector: 'app-order-list',
	templateUrl: './order-list.component.html',
	styleUrls: ['./order-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class OrderListComponent implements OnInit {
	categories: any[] = [];
	orders: any[] = [];
	page = 1;
	totalRecord = 0;
	search = '';
	sortBy = '';
	maxSize = PaginationMaxSize;
	constructor(private commonApisService: CommonApisService) { }

	ngOnInit(): void {
		this.fetchCategories();
		this.fecthOrderList();
	}

	fetchCategories(): void {
		this.commonApisService.fetchCategories().subscribe(
			(response) => {
				if (response.success) {
					this.categories = response.data;
				}
			},
			(error) => {
				console.log(`Fetch Category Api Error ${error}`);
			});
	}

	fecthOrderList(): void {
		this.commonApisService
			.fecthOrderList(this.page, this.search, this.sortBy)
			.subscribe(
				(response) => {
					if (response.success) {
						this.orders = response.data.order_list;
						this.totalRecord = response.data.total_record;
					}
				},
				(error) => {
					console.log(`Order List Api Error ${error}`);
				}
			);
	}

	showMore(categorySlug: string): void {
		this.commonApisService.redirectToCategory(categorySlug);
	}

	pageChanged($event): void {
		this.page = $event.page;
		this.fecthOrderList();
	}
}
