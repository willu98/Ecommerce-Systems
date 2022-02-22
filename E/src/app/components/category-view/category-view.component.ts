import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { Category, Product } from '../../models/product.model';


@Component({
  selector: 'app-category-view',
  template: `
    <div id="category" class="container-lg container-fluid">
      <div class="row row-cols-1 row-cols-lg-4 g-4">
      <div *ngIf="category">
        <app-category-card [category]="category" routerLink="/"></app-category-card>
      </div>
        <div class="col col-lg-9">
          <div id="product-columns">
            <div id="product-list-column">
              <div id="product-list-scroller">
                <div id="product-list" class="list-group list-group-flush">
                  <a class="list-group-item list-group-item-action product-card"
                    *ngFor="let product of products"
                    [ngClass]="{'active': selected && product.id === selected.id }"
                    [routerLink]="'/products/' + product.id">
                    {{ product.name }}
                  </a>

                </div>
              </div>
            </div>
            <div id="product-info">
              <app-product-details [product]="selected"></app-product-details>            
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class CategoryViewComponent implements OnInit {
  category: Category = {id: 0, name: ''};
  products: Product[] = [];
  selected: Product | undefined;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
    private api: ProductService,    
  ) { }

  showCategory(catId: number) {
    this.api.getCategoryById(catId).subscribe({
      next: (category) => {
        this.category = category;
        this.api.getProductsByCategory(catId).subscribe((products: Product[]) => {
          this.products = products;
        });
      },
      error: (error) => {
        this.router.navigate(['/']);
      }
    });
  }

  showProduct(prodId: string) {
    this.api.getProductById(prodId).subscribe({
      next: (product:Product) => {
        this.selected = product;
        this.api.getCategoryById(product.catId).subscribe({
          next: (category) => {
            this.category = category;
            this.api.getProductsByCategory(product.catId).subscribe((products: Product[]) => {
              this.products = products;
            });
          }
        });
              
      },
      error: (error) => {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has('catId')) {
        this.showCategory(+params.get('catId')!);
        
      } else if (params.has('prodId')) {
        this.showProduct(params.get('prodId')!); // assign product to this.selected
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
