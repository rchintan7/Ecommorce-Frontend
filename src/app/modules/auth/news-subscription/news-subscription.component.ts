import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';

@Component({
  selector: 'app-news-subscription',
  templateUrl: './news-subscription.component.html',
  styleUrls: ['./news-subscription.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NewsSubscriptionComponent implements OnInit {
  isSelected = 0;
  constructor(
    private commonApisService: CommonApisService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.commonApisService.redirectToLogin();
    }
    this.commonApisService.getSubscription().subscribe((response) => {
      if (response.success) {
        this.isSelected = Number(response.data.news_subscription);
      }
    }, (error) => {
      console.log(`Get Subscription Api Error ${error}`);
    });
  }

  saveNewSubscription(): void {
    this.commonApisService
    .saveSubscription(this.isSelected)
    .subscribe((response) => {
      if (response.success) {
        this.authService.sucessMessage(response.message);
      }
    }, (error) => {
      console.log(`Save Subscription Api Error ${error}`);
    });
  }
}
