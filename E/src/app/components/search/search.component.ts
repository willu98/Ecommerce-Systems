import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
@Component({
  selector: 'app-search',
  template: `
    <div id="search-results" class="container-lg container-fluid">
      <div class="row row-cols-1 row-cols-lg-4 g-4">

        <div class="col ratio-1x1 square">
          <div class="card catalog-titlecard bg-dark text-white text-center">
            <div class="card-img-overlay">
              <h1 class="card-title display-6">Search Results</h1>
            </div>
          </div>
        </div>
     
        <div class="col col-lg-9">
          <div id="product-columns">
            <div id="product-list-column">
              <div id="product-list-scroller">
                <div id="product-list" class="list-group list-group-flush">
                  <a class="list-group-item list-group-item-action product-card"
                    *ngFor="let product of products"
                    >
                    {{ product.description }}
                  </a>

                </div>
              </div>
            </div>
            <div id="product-info">

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class SearchComponent implements OnInit {
  search: string='';
  products:Product[]=[];

  constructor(
    private route: ActivatedRoute,
    private api: ProductService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params:ParamMap) => {
      this.search = params.get('search')!;
      this.api.getProducts().subscribe((products:Product[]) => {
        this.products = products.filter(product => {
          return product.description.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        });
      });
    });
  }

}
