import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-table',
  template: `
    <table id="cart-table" class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Cost</th>
          <th scope="col">Quantity</th>
          <th scope="col">Subtotal</th>
          <th scope="col" *ngIf="updatable">Update</th>
        </tr>
      </thead>
      <tbody class="table-hover">
        <tr *ngFor="let item of items">
          <td scope="row">{{ item.id }}</td>
          <td>{{ item.product!.name }}</td>
          <td>{{ item.product!.cost | currency }}</td>
          <td>
            <ng-template [ngIf]="updatable" [ngIfElse]="notUpdatable">
              <input type="text" class="qty-input form-control" [(ngModel)]="item.qty" (ngModelChange)="qtyAsNumber(item)">
            </ng-template>
            <ng-template #notUpdatable>
              {{ item.qty }}
            </ng-template>
          </td>
          <td>{{ item.product!.cost * item.qty | currency }}</td>
          <td *ngIf="updatable">
            <button type="button" tabindex="0"
                    class="update-cart btn btn-primary"
                    (click)="updateCart(item)">Update</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col" >{{ total | currency }}</th>
          <th scope="col" *ngIf="updatable"></th>
        </tr>
      </tfoot>
    </table>
  `,
  styles: [
  ]
})
export class CartTableComponent implements OnInit {
  @Input() updatable: boolean = false;
  @Output() onCartUpdate = new EventEmitter<CartItem[]>();

  total:number=0;
  currency?:number;

  items: CartItem[] = [];

  constructor(private api: CartService) { }
  qtyAsNumber(item: CartItem) {
    item.qty = item.qty ? + item.qty : 0;
    this.total = 0;
    this.api.getCart().subscribe({
      next: (items: CartItem[]) => {
        this.items.forEach(i => {
          if(i.id !== item.id){
            this.total+= (i.product!.cost * i.qty)
          }
        });
      }
    });
  }


  updateCart(item: CartItem){
    this.api.updateCart(item, item.qty).subscribe({
      next: (items: CartItem[]) => {
        alert("Cart Updated");
        this.onCartUpdate.emit(items); // items: CartItem[]

      }
    });

    
  }

  ngOnInit(): void {
    this.api.getCart().subscribe({
      next: (items: CartItem[]) => {
        this.items = items;
        this.items.forEach(item => this.total+= (item.product!.cost * item.qty));
        this.onCartUpdate.emit(items); // items: CartItem[]

      }
    });    
    
  }

}
