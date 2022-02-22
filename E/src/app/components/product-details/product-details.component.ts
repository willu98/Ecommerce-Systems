import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { Observable, zip } from 'rxjs';

@Component({
  selector: 'app-product-details',
  template: `
    <ng-template [ngIf]="product" [ngIfElse]="noProduct">

      <div class="card">
        <div class="card-body">
          <p class="card-text"><small class="text-muted">{{ product.id }}</small></p>
          <h5 class="class-title display-7">{{ product.name }}</h5>
          <p class="card-text">{{ product.description }}</p>
          <p class="card-text">
            <button type="button" data-id="{{ product.id }}" class="add-to-cart btn btn-primary" tabindex="0" (click)="updateCart()">
              Add To Cart
            </button>
          </p>
        </div>
        <div class="card-footer text-muted">
          <div class="row row-cols-2">
            <div class="col">\${{ product.cost }}</div>
          </div>
        </div>
      </div>


    </ng-template>
    <ng-template #noProduct>
      <div class="card">
        <div class="card-body">
          <p class="card-text text-center">Select a product</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
  ]
})
export class ProductDetailsComponent implements OnInit {
  @Input() product:Product|undefined;

  updateCart(){    
    this.api.addToCart(this.product as Product).subscribe({
      next: (items:CartItem[]) => {   
        this.router.navigate(['/cart']);                   
      }
    });       
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: CartService,
  ) { }


  ngOnInit(): void {
  }

}
