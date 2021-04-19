import { TestBed } from '@angular/core/testing';

import { CommonApisService } from './common-apis.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CommonApisService', () => {
  let service: CommonApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CommonApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
