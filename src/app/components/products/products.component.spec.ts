import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { generateManyProducts } from '../../mocks/product.mock';
import { of } from 'rxjs';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getAllSimple']);

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllProducts on ngOnInit', () => {
    const mockProducts: Product[] = generateManyProducts();

    // Configurar el mock para que getAllSimple devuelva un Observable con los productos simulados
    productsService.getAllSimple.and.returnValue(of(mockProducts));

    // Ejecutar ngOnInit
    fixture.detectChanges(); // Esto llamará a ngOnInit

    // Verificar que el método del servicio fue llamado una vez
    expect(productsService.getAllSimple).toHaveBeenCalledTimes(1);

    // Verificar que los productos del componente se hayan actualizado correctamente
    expect(component.products).toEqual(mockProducts);
  });

});
