import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ValidatorFn, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Province, Shipping, ShippingConstants} from '../../models/shipping.model';
import { ShippingService  } from '../../services/shipping.service';

@Component({
  selector: 'app-ship-to-view',
  template: `
    <div id="ship-to" class="container-lg container-fluid">
      <div class="row align-items-start">
        <div class="col col-lg-6 offset-lg-3">
          <h1 class="display-6 text-center">
            <a (click)="goBack()" class="back-btn fw-lighter text-dark text-decoration-none"><i class="bi bi-arrow-left-circle"></i></a>
            <span class="ms-4">Shipping Address</span>
          </h1>
          <hr class="mt-4">
        </div>
      </div>

      <form [formGroup]="shippingAddress" (ngSubmit)="onSubmit()" class="container"> <!-- Add [formGroup] and (ngSubmit) here -->
        <div class="row align-items-start">
          <div class="col col-lg-6 offset-lg-3">
            <div class="mb-3 row">
              <label id="recipient-label" for="recipient" class="col-sm-2 col-form-label fw-bold">Recipient:</label>
              <div class="col-sm-10">
                <input type="text" name="recipient" formControlName="recipient"
                required class="form-control" placeholder="Jane Doe"
                [ngClass]="{'is-invalid': invalidInput('recipient'),
                            'is-valid':   validInput('recipient')}">
              </div>
            </div>
            <div class="mb-3 row">
              <label id="streetAddress-label" for="streetAddress" class="col-sm-2 col-form-label fw-bold">Address:</label>
              <div class="col-sm-10">

                <input type="text" name="streetAddress" formControlName="streetAddress"
                required class="form-control" placeholder="4700 Keele Street"
                [ngClass]="{'is-invalid': invalidInput('streetAddress'),
                            'is-valid':   validInput('streetAddress')}">              

              </div>
            </div>
            <div class="mb-3 row">
              <div class="col-sm-10 offset-sm-2">
                <input type="text" name="streetAddress2" formControlName="streetAddress2"
                required class="form-control" placeholder=""
                [ngClass]="{'is-invalid': invalidInput('streetAddress2'),
                            'is-valid':   validInput('streetAddress2')}">

              </div>
            </div>
            <div class="mb-3 row">
              <label id="city-label" for="city" class="col-sm-2 col-form-label fw-bold">City:</label>
              <div class="col-sm-10">
                <input type="text" name="city" formControlName="city"
                required class="form-control" placeholder="Toronto"
                [ngClass]="{'is-invalid': invalidInput('city'),
                            'is-valid':   validInput('city')}">                
              </div>
            </div>
            <div class="mb-3 row">
              <label id="province-label" for="province" class="col-sm-2 col-form-label fw-bold">Prov./State:</label>
              <div class="col-sm-10">

                <select name="province" formControlName="province" required class="form-select"
                        [ngClass]="{'is-invalid': invalidInput('province'),
                                    'is-valid':   validInput('province')}">

                  <option [ngValue]="null" disabled hidden selected>Select...</option>

                  <optgroup label="Canada">
                    <option *ngFor="let province of CanadianProvincesAndTerritories" [ngValue]="province">
                      {{ province.code }} - {{ province.name }}
                    </option>
                  </optgroup>

                  <optgroup label="United States">
                    <option *ngFor="let state of USStatesAndTerritories" [ngValue]="state">
                      {{ state.code }} - {{ state.name }}
                    </option>
                  </optgroup>

                </select>

              </div>
            </div>
            <div class="mb-3 row">
              <label id="postalCode-label" for="postalCode" class="col-sm-2 col-form-label fw-bold">Postal/Zip:</label>
              <div class="col-sm-10">
                <input type="text" name="postalCode" formControlName="postalCode"
                required class="form-control" placeholder="A1B 2C3"
                [ngClass]="{'is-invalid': invalidInput('postalCode'),
                            'is-valid':   validInput('postalCode')}">                    
              </div>
            </div>
            <div class="mb-3 row">
              <label id="delivery-label" for="delivery" class="col-sm-2 col-form-label fw-bold">Delivery:</label>
              <div class="col-sm-10">
                <div class="card"><div class="card-body">

                  <div class="form-check" *ngFor="let method of DeliveryMethods; let i = index">
                    <input type="radio" id="delivery-{{ i }}" name="delivery" formControlName="delivery"
                          [value]="method" class="form-check-input">
                    <label for="delivery-{{ i }}" id="delivery-{{ i }}-label"
                          class="form-check-label">{{ method }}</label>
                  </div>

                </div></div>
              </div>
            </div>
            <div class="mb-3 row"><hr>
              <div class="col-sm-10 offset-sm-2 d-grid">
                <button class="btn btn-primary" type="submit">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
  ]
})
export class ShipToViewComponent implements OnInit {
  CanadianProvincesAndTerritories : Province[] = [];
  USStatesAndTerritories : Province[] = [];
  DeliveryMethods : string[] = [];
  formSubmitted: boolean = false;
  
  PostalCodeRegEx = /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$/i;
  ZipCodeRegEx    = /^[0-9]{5}(?:[-\s][0-9]{4})?$/;

  shippingAddress = this.fb.group({
    recipient:      ['', Validators.required],
    streetAddress:  ['', Validators.required],
    streetAddress2: [''],
    city:           ['',   Validators.required],
    province:       [null, Validators.required],
    postalCode:     ['',  [Validators.required, this.validatePostalOrZipCode.bind(this)]],
    delivery:       ['Standard']
  });

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private shipping: ShippingService,
    private title: Title,
  ) { }

  invalidInput(input: string): boolean {
    
    if (this.formSubmitted) { // boolean set to true when the submit is clicked
      return this.shippingAddress.get(input)!.invalid;
    } else {
      return false;
    }
  }

  validatePostalOrZipCode(fc: FormControl) {
    return (this.PostalCodeRegEx.test(fc.value) || this.ZipCodeRegEx.test(fc.value)) ? null : {
      validInput: {
        valid: false
      }
    };
  }

  validInput(input: string): boolean {
    if (this.shippingAddress.touched || this.shippingAddress.dirty) {
      return this.shippingAddress.get(input)!.valid;
    } else {
      return false;
    }
  }

  onSubmit() {
    console.log("TESTING");
    this.formSubmitted = true;
    console.log(this.shippingAddress);
    if (this.shippingAddress.valid) {      
      this.shipping.shippingAddress = this.shippingAddress.value; // Here
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  getPostalCodeValidator(province?: Province) {
    if (!province) {
      return this.validatePostalOrZipCode.bind(this) as ValidatorFn;
    }
    return this.CanadianProvincesAndTerritories.includes(province)
        ? Validators.pattern(this.PostalCodeRegEx)
        : Validators.pattern(this.ZipCodeRegEx);
  }

  ngOnInit(): void {
    this.title.setTitle('Ship To');
    if (this.shipping.shippingAddress) {
      this.shippingAddress.setValue(this.shipping.shippingAddress);
    }    
    this.CanadianProvincesAndTerritories = ShippingConstants.CanadianProvincesAndTerritories;
    this.USStatesAndTerritories = ShippingConstants.USStatesAndTerritories;
    this.DeliveryMethods = ShippingConstants.DeliveryMethods;

    this.shippingAddress.get('province')!.valueChanges.subscribe((province?: Province) => {
      const postalCode = this.shippingAddress.get('postalCode')!;
      const validator  = this.getPostalCodeValidator(province);
      postalCode.setValidators([Validators.required, validator]);
      postalCode.updateValueAndValidity();
    });    
  }

}
