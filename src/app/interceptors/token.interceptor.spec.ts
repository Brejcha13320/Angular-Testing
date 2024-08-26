import { TestBed } from '@angular/core/testing';
// import { HttpInterceptorFn } from '@angular/common/http';

import { TokenInterceptor } from "./token.interceptor";
import { TokenService } from '../services/token.service';

// import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TokenService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        TokenInterceptor,
        { provide: TokenService, useValue: spy }
      ],
    });
    interceptor = TestBed.inject(TokenInterceptor);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

});
