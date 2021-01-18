import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('EmployeeService', () => {
  let httpTestingController: HttpTestingController;
  let service: EmployeeService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [EmployeeService],
      imports: [HttpClientTestingModule]
  }));

  afterEach(() => {
    httpTestingController.verify();
  });

  // it('should be created', () => {
  //   const service: EmployeeService = TestBed.get(EmployeeService);
  //   expect(service).toBeTruthy();
  // });
});
