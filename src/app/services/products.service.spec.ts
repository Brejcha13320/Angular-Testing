import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { ProductsService } from './products.service';
import { Product, UpdateProductDTO } from '../models/product.model';
import { environment } from '../../environments/environment';
import { generateCreateProductDTO, generateManyProducts, generateOneProduct } from '../mocks/product.mock';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService
      ]
    });
    service = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya solicitudes HTTP pendientes después de cada prueba
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for $getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      const mockProducts: Product[] = generateManyProducts();

      service.getAllSimple().subscribe((products) => {
        expect(products.length).toEqual(mockProducts.length)
        expect(products).toEqual(mockProducts); // Verifica que los datos sean los esperados
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockProducts); // Simula una respuesta HTTP con los datos simulados
    });
  });

  describe('Tests for $getAll', () => {
    it('should return a product list', (doneFn) => {
      const mockProducts: Product[] = generateManyProducts();

      service.getAll().subscribe((products) => {
        expect(products.length).toEqual(mockProducts.length)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockProducts); // Simula una respuesta HTTP con los datos simulados
    });

    it('should return a product list with taxes', (doneFn) => {
      const mockProducts: Product[] = generateManyProducts();
      mockProducts.push({
        ...generateOneProduct(),
        price: -100
      })

      service.getAll().subscribe((products) => {
        expect(products.length).toEqual(mockProducts.length)

        products.forEach(({ price, taxes }) => {
          if (price < 0) {
            expect(taxes).toEqual(0);
          } else {
            expect(taxes).toEqual(price * .19);
          }
        })

        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockProducts); // Simula una respuesta HTTP con los datos simulados
    });

    it('should send query params', (doneFn) => {
      spyOn(service, 'getAll').and.callThrough();
      const mockProducts: Product[] = generateManyProducts();
      const limit = 10;
      const offset = 3;

      service.getAll(limit, offset).subscribe((products) => {
        expect(products.length).toEqual(mockProducts.length)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`
      const req = httpController.expectOne(url);
      const params = req.request.params;
      expect(req.request.method).toEqual('GET');
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      req.flush(mockProducts); // Simula una respuesta HTTP con los datos simulados
      expect(service.getAll).toHaveBeenCalledWith(limit, offset);
    });
  });

  describe('Tests for $create', () => {
    it('should return a new product', (doneFn) => {
      spyOn(service, 'create').and.callThrough();
      const mockProduct = generateOneProduct();
      const dto = generateCreateProductDTO();

      service.create({ ...dto }).subscribe((product) => {
        expect(product).toEqual(mockProduct)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(dto) // Valida que el DTO sea el mismo que se envia en el body
      req.flush(mockProduct); // Simula una respuesta HTTP con los datos simulados
      expect(service.create).toHaveBeenCalledWith(dto);
    })
  })

  describe('Tests for $update', () => {
    it('should update a product', (doneFn) => {
      spyOn(service, 'update').and.callThrough();
      const mockProduct = generateOneProduct();
      const dto: UpdateProductDTO = { title: 'new product' };
      const productId = '1';

      service.update(productId, { ...dto }).subscribe((product) => {
        expect(product).toEqual(mockProduct)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto) // Valida que el DTO sea el mismo que se envia en el body
      req.flush(mockProduct); // Simula una respuesta HTTP con los datos simulados
      expect(service.update).toHaveBeenCalledWith(productId, dto);
    })
  })

  describe('Tests for $delete', () => {
    it('should delete a product', (doneFn) => {
      spyOn(service, 'delete').and.callThrough();
      const mockData = true;
      const productId = '1';

      service.delete(productId).subscribe((data) => {
        expect(data).toEqual(mockData)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData); // Simula una respuesta HTTP con los datos simulados
      expect(service.delete).toHaveBeenCalledWith(productId);
    })
  })

});
