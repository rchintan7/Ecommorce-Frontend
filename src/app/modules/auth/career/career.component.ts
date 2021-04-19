import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CareerComponent implements OnInit {
  career = {
    title: '',
    description: ''
  };
  jobList = [];
  constructor(
    private commonApisService: CommonApisService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getCareer();
  }

  getCareer(): void{
    this.commonApisService.getCareer().subscribe((response) => {
      if (response.success){
        this.career.title = response.data.title;
        this.career.description = response.data.description;
        this.jobList = response.data.jobList;
        console.log(this.jobList);
      }
      else{
        this.authService.errorMessage(response.message);
      }
    }, (error) => {
      console.log(`Get Career Api error ${error}`);
    });
  }
}
