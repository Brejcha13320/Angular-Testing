import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService,
      ]
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for $login', () => {
    it('should return a access_token', (doneFn) => {
      spyOn(service, 'login').and.callThrough();
      const mockData: Auth = { access_token: 'token123' };
      const email = 'jesus@gmail.com';
      const password = 'j123485';


      service.login(email, password).subscribe((access_token) => {
        expect(access_token).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(mockData);
      expect(service.login).toHaveBeenCalledWith(email, password);
    });

    it('should call #saveToken', (doneFn) => {
      spyOn(service, 'login').and.callThrough();
      spyOn(tokenService, 'saveToken');
      const mockData: Auth = { access_token: 'token123' };
      const email = 'jesus@gmail.com';
      const password = 'j123485';


      service.login(email, password).subscribe((access_token) => {
        expect(access_token).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledWith(mockData.access_token)
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(mockData);
      expect(service.login).toHaveBeenCalledWith(email, password);
    });
  });


});
