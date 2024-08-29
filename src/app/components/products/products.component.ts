import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { ValueService } from '../../services/value.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  limit = 10;
  offset = 0;
  status: 'init' | 'loading' | 'success' | 'error' = 'init';
  promiseRta = '';

  constructor(
    private productsService: ProductsService,
    private valueService: ValueService,
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.status = 'loading';
    this.productsService.getAll(this.limit, this.offset)
      .subscribe({
        next: (products) => {
          this.products = [...this.products, ...products];
          this.offset += this.limit;
          this.status = 'success';
        },
        error: () => {
          /**
           * esto es para testear el setTimeout y el error en los observables
           * no es recomendado usar setTimeout y menos en esta parte del codigo
           */
          setTimeout(() => {
            this.products = [];
            this.status = 'error';
          }, 1000)
        }
      });
  }

  async callPromise() {
    this.promiseRta = await this.valueService.getPromiseValue();
  }

}
