import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ManufacturerComponent implements OnInit {
  manufacturerList: any[] = [];
  constructor(
    private commonApisService: CommonApisService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getManufacturerList();
  }

  getManufacturerList(): void {
    this.commonApisService.getManufacturerList().subscribe((response) => {
      if (response.success) {
        this.manufacturerList = response.data;
      } else {
        this.authService.errorMessage(response.message);
      }
    });
  }

  redirect(manufacturer: string): void {
    this.router.navigateByUrl('paieska?manufacturer=' + encodeURIComponent(manufacturer));
  }
}
