import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-view',
  template: `
    <div id="cart" class="container-lg container-fluid">
      <h1 class="display-6"><a (click)="goBack()" class="back-btn fw-lighter text-dark text-decoration-none"><i class="bi bi-arrow-left-circle"></i></a> Cart</h1>
      <app-cart-table [updatable]="true" (onCartUpdate)="cartUpdate($event)"></app-cart-table>

      <div class="row align-items-start">
          <div class="col text-center">
            <button *ngIf="cart.length > 0" class="btn btn-success btn-lg" [routerLink]="['/checkout']">Checkout</button><!-- goto: /checkout -->
          </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class CartViewComponent implements OnInit {
  @Output() onCartUpdate = new EventEmitter<CartItem[]>();

  cart: CartItem[] = [];

  constructor(
    private location: Location
  ) { }

  cartUpdate(cart: CartItem[]) {
    this.cart = cart;
  }

  goBack() {
    this.location.back();
  }



  ngOnInit(): void {

  }

}
