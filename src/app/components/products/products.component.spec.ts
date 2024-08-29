import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { generateManyProducts } from '../../mocks/product.mock';
import { of, defer } from 'rxjs';
import { ProductComponent } from '../product/product.component';
import { ValueService } from '../../services/value.service';
import { By } from '@angular/platform-browser';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getPromiseValue']);

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: ValueService, useValue: valueServiceSpy },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #getAllProducts on ngOnInit', () => {
    const mockProducts: Product[] = generateManyProducts();

    // Configurar el mock para que getAllSimple devuelva un Observable con los productos simulados
    productsService.getAll.and.returnValue(of(mockProducts));

    // Ejecutar ngOnInit
    fixture.detectChanges(); // Esto llamará a ngOnInit

    // Verificar que el método del servicio fue llamado una vez
    expect(productsService.getAll).toHaveBeenCalledTimes(1);

    // Verificar que los productos del componente se hayan actualizado correctamente
    expect(component.products).toEqual(mockProducts);
  });

  describe('Tests for #getAllProducts', () => {
    it('should return a product list from service', () => {
      // ngOnInit Carga 15 Productos de manera inicial
      const lengthProducts = 15;
      const mockProducts: Product[] = generateManyProducts(lengthProducts);
      productsService.getAll.and.returnValue(of(mockProducts));
      fixture.detectChanges();

      const countPrev = component.products.length; // 15
      component.getAllProducts(); // LoadMore -> El arreglo de products incrementa
      fixture.detectChanges();

      expect(component.products.length).toEqual(lengthProducts + countPrev);
    });

    it('should change the status of loading => success', fakeAsync(() => {
      const lengthProducts = 15;
      const mockProducts: Product[] = generateManyProducts(lengthProducts);
      productsService.getAll.and.returnValue(defer(() =>
        Promise.resolve(mockProducts) //Proceso de exito
      )); //se queda pendiente hasta que le demos tick
      expect(component.status).toEqual('init');
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(); //exec, obs, setTimeout, promise
      fixture.detectChanges();

      expect(component.status).toEqual('success');
    }));

    it('should change the status of loading => error', fakeAsync(() => {
      productsService.getAll.and.returnValue(defer(() =>
        Promise.reject('error') //Proceso de error
      )); //se queda pendiente hasta que le demos tick
      expect(component.status).toEqual('init');
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(1500);// el tiempo del settimeout y un poco mas //exec, obs, setTimeout, promise
      fixture.detectChanges();

      expect(component.status).toEqual('error');
    }));

  });

  describe('Tests for #callPromise', () => {

    beforeEach(() => {
      /**
       * como no tengo desde el beforeEach principal que carge productos y desde 0
       * entonces aca intentar desdepues del detectChanges va cargar el getAll y esto
       * no retorna undefined y el observable se rompe y da error
       */
      productsService.getAll.and.returnValue(of([]));
    });

    it('should call to promise with async/await', async () => {
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));

      await component.callPromise();
      fixture.detectChanges();

      expect(component.promiseRta).toEqual(mockMsg);
    });

    it('should call to promise with fakeAsync/tick', fakeAsync(() => {
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));

      component.callPromise();
      tick();
      fixture.detectChanges();

      expect(component.promiseRta).toEqual(mockMsg);
    }));

    it('should call to promise when btn was clicked with fakeAsync/tick', fakeAsync(() => {
      spyOn(component, 'callPromise').and.callThrough();
      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      const buttonDebug = fixture.debugElement.query(By.css('.btn_promise'));
      buttonDebug.triggerEventHandler('click', null); //hace click -> llama la funcion

      tick(); //espera que se haga el await y actualiza el promiseRta

      fixture.detectChanges(); //detectamos los cambios en las variables y hace update del render
      const pDebug = fixture.debugElement.query(By.css('.p_rta'));
      const p: HTMLElement = pDebug.nativeElement; //obtenemos el elemento html p

      expect(component.callPromise).toHaveBeenCalled();
      expect(component.promiseRta).toEqual(mockMsg);
      expect(p.textContent).toEqual(mockMsg);

    }));

  });

});
