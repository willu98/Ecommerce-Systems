import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippingService  } from '../../services/shipping.service';
import { Location } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-view',
  template: `
    <div id="checkout" class="container-lg container-fluid">
      <div class="row align-items-start">
        <div class="col">
          <h1 class="display-6">
            <a (click)="goBack()" class="back-btn fw-lighter text-dark text-decoration-none"><i class="bi bi-arrow-left-circle"></i></a>
            <span class="ms-4">Checkout</span>
          </h1>
          <hr class="mt-4">
        </div>
      </div>
      <div class="row align-items-start">
        <div class="col col-lg-9">
          <app-cart-table></app-cart-table>


        </div>
        <div class="col col-lg-3">
          <div class="card">
            <div class="card-header text-white bg-primary">Shipping Address</div>
            <div class="card-body">
              <p class="card-text" *ngIf="shippingAddress">
                <!-- replace these with the appropriate fields -->
                <b>{{shippingAddress.recipient}}</b><br>
                {{shippingAddress.streetAddress}}<br>
                <span>{{shippingAddress.streetAddress2}}<br></span>
                {{shippingAddress.city}}, {{shippingAddress.province.code}}<br>
                {{shippingAddress.postalCode}}
              </p>
            </div>
            <div class="card-footer" *ngIf="shippingAddress">
            {{shippingAddress.delivery}}
            </div>
          </div>
        </div>
      </div>
      <div class="row align-items-start">
        <div class="col col-lg-9 text-center">
          <button class="btn btn-primary btn-lg" [routerLink]="['/']">Continue Shopping</button><!-- goto: /catalog -->
          <button class="btn btn-success btn-lg ms-4"  (click)="emptyCart()">Checkout</button><!-- goto: /finish -->
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class CheckoutViewComponent implements OnInit {

  constructor(
    private location: Location,
    private title: Title,
    private router: Router,
    private shipping: ShippingService,
    private api: CartService
  ) { }

  goBack() {
    this.location.back();
  }

  emptyCart() {
    this.api.checkoutCart(this.shippingAddress!).subscribe({
      next: () => {
        this.router.navigate(['/finish']);
      }  
    }); 
  }

  get shippingAddress() {
    return this.shipping.shippingAddress;
  }

  ngOnInit(): void {
    this.title.setTitle('Checkout');
    if (!this.shipping.shippingAddress) {
      this.router.navigate(['/shipTo'], { replaceUrl: true });
    }
  }

}
