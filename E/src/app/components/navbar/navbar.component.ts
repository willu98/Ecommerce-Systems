import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" [routerLink]="['/']" >Models R US</a>

          <form [formGroup]="searchRes" (ngSubmit)="onSubmit()" class="d-flex w-50" (keyup.enter)="onSubmit()">

            <input class="form-control me-2" type="search" placeholder="Search" 
                  aria-label="Search" name="searchText" formControlName="search" required>

            <button type="submit" class="btn btn-outline-success" [disabled]="validInput()">
              <i class="bi bi-search fs-4"></i>
            </button>
          </form>        

        <div class="d-flex">
          <a [routerLink]="['/shipTo']" class="btn btn-outline-dark pt-0 pb-0 me-1"><i class="bi bi-box-seam fs-4"></i></a>
          <a [routerLink]="['/cart']" class="btn btn-outline-dark pt-0 pb-0"><i class="bi bi-cart4 fs-4"></i></a>
        </div>
      </div>
    </nav>
  `,
  styles: [
  ]
})
export class NavbarComponent implements OnInit {
  formSubmitted: boolean = false;

  searchRes = this.fb.group({
    search:      ['', Validators.required],
  });

  validInput(): boolean {
    if(this.searchRes.value.search.length >= 3)
    {
      return false;
    }
    return true;

  }


  constructor(    
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.formSubmitted = true;

    console.log(this.searchRes.value.search);
    this.router.navigate(['/search'], { queryParams: {search:this.searchRes.value.search} });
  }
}
