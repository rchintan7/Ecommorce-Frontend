import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-non-auth',
  templateUrl: './non-auth.component.html',
  styleUrls: ['./non-auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NonAuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
