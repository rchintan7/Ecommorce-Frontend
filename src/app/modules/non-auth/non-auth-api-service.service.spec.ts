import { TestBed } from '@angular/core/testing';

import { NonAuthApiServiceService } from './non-auth-api-service.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('NonAuthApiServiceService', () => {
  let service: NonAuthApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NonAuthApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
