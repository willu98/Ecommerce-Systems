import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finish-view',
  template: `
    <div id="finish" class="container-lg container-fluid">
      <div class="row align-items-start mt-4">
        <div class="col col-lg-6 offset-lg-3 text-center">
          <i class="bi bi-bag-check text-success" style="font-size: 200pt"></i><br>
          <h1 class="display-6 mt-1">Thanks for Shopping!</h1>
        </div>
      </div>
      <div class="row align-items-start mt-4">
        <div class="col col-lg-6 offset-lg-3 text-center">
          <hr><button class="btn btn-primary btn-lg" [routerLink]="['/']">Home</button><!-- goto: / -->
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class FinishViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
