import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { ProductsService } from './products.service';
import { Product, UpdateProductDTO } from '../models/product.model';
import { environment } from '../../environments/environment';
import { generateCreateProductDTO, generateManyProducts, generateOneProduct } from '../mocks/product.mock';
import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import { TokenService } from './token.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpController: HttpTestingController
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });
    service = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
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
      spyOn(tokenService, 'getToken').and.returnValue('123');
      const mockProducts: Product[] = generateManyProducts();

      service.getAllSimple().subscribe((products) => {
        expect(products.length).toEqual(mockProducts.length)
        expect(products).toEqual(mockProducts); // Verifica que los datos sean los esperados
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(`Bearer 123`);
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
    });
  });

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
    });
  });

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
    });
  });

  describe('Tests for $getOne', () => {

    beforeEach(() => {
      spyOn(service, 'getOne').and.callThrough();
    });

    it('should return a product', (doneFn) => {
      const mockProduct = generateOneProduct();
      const productId = '1';

      service.getOne(productId).subscribe((product) => {
        expect(product).toEqual(mockProduct)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockProduct); // Simula una respuesta HTTP con los datos simulados
      expect(service.getOne).toHaveBeenCalledWith(productId);
    });

    it('should a message for status code 409 conflic', (doneFn) => {
      const productId = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      };

      service.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError); // Simula una respuesta HTTP con los datos simulados
      expect(service.getOne).toHaveBeenCalledWith(productId);
    });

    it('should a message for status code 404 not found', (doneFn) => {
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      };

      service.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError); // Simula una respuesta HTTP con los datos simulados
      expect(service.getOne).toHaveBeenCalledWith(productId);
    });

    it('should a message for status code not defined', (doneFn) => {
      const productId = '1';
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
      };

      service.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('No estas permitido');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError); // Simula una respuesta HTTP con los datos simulados
      expect(service.getOne).toHaveBeenCalledWith(productId);
    });

    it('should a message for status code 401 unauthorized', (doneFn) => {
      const productId = '1';
      const msgError = '400 message';
      const mockError = {
        status: HttpStatusCode.BadRequest,
        statusText: msgError
      };

      service.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError); // Simula una respuesta HTTP con los datos simulados
      expect(service.getOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('Tests for $getByCategory', () => {
    beforeEach(() => {
      spyOn(service, 'getByCategory').and.callThrough();
    });

    it('should return a product list', (doneFn) => {
      const mockProducts: Product[] = generateManyProducts();
      const categoryId = '1';

      service.getByCategory(categoryId).subscribe((products) => {
        expect(products.length).toEqual(mockProducts.length)
        expect(products).toEqual(mockProducts)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/categories/${categoryId}/products`
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockProducts); // Simula una respuesta HTTP con los datos simulados
      expect(service.getByCategory).toHaveBeenCalledWith(categoryId);
    });

    it('should send query params', (doneFn) => {
      const mockProducts: Product[] = generateManyProducts();
      const categoryId = '1';
      const limit = 10;
      const offset = 3;

      service.getByCategory(categoryId, limit, offset).subscribe((products) => {
        expect(products.length).toEqual(mockProducts.length);
        expect(products).toEqual(mockProducts);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/categories/${categoryId}/products?limit=${limit}&offset=${offset}`
      const req = httpController.expectOne(url);
      const params = req.request.params;
      expect(req.request.method).toEqual('GET');
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      req.flush(mockProducts); // Simula una respuesta HTTP con los datos simulados
      expect(service.getByCategory).toHaveBeenCalledWith(categoryId, limit, offset);
    });

  })

  describe('Tests for $fetchReadAndUpdate', () => {
    beforeEach(() => {
      spyOn(service, 'fetchReadAndUpdate').and.callThrough();
      spyOn(service, 'getOne').and.callThrough();
      spyOn(service, 'update').and.callThrough();
    });

    it('should return a [product, product]', (doneFn) => {
      const mockProduct1 = generateOneProduct();
      const mockProduct2 = generateOneProduct();
      const dto: UpdateProductDTO = { title: 'new product' };
      const productId = '1';

      service.fetchReadAndUpdate(productId, { ...dto }).subscribe(([product1, product2]) => {
        expect(product1).toEqual(mockProduct1)
        expect(product2).toEqual(mockProduct2)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`

      const req1 = httpController.expectOne(req => req.method === 'GET');
      expect(req1.request.method).toEqual('GET');
      req1.flush(mockProduct1); // Simula una respuesta HTTP con los datos simulados
      expect(service.getOne).toHaveBeenCalledWith(productId);

      const req2 = httpController.expectOne(req => req.method === 'PUT');
      expect(req2.request.method).toEqual('PUT');
      expect(req2.request.body).toEqual(dto) // Valida que el DTO sea el mismo que se envia en el body
      req2.flush(mockProduct2); // Simula una respuesta HTTP con los datos simulados
      expect(service.update).toHaveBeenCalledWith(productId, dto);
    });
  })

});
