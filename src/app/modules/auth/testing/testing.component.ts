import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-testing',
	templateUrl: './testing.component.html',
	styleUrls: ['./testing.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class TestingComponent implements OnInit {
	name = "Angular";
	style: string;
	myThumbnail = "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
	myFullresImage = "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
	selectedImage = "http://kretoss.com/project/santechniku_centras_backend/uploads/product/image/catalog/Vonios iranga/Potinkines sistemos/Grohe/5 in 1/525a0db84deb8cd1166c1177f42a.webp";

	constructor() { }
	ngOnInit(): void {
	}
}
