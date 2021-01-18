import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Employee } from './employee';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private emp: Employee[];
  private empUpdated = new Subject<{ emp: Employee[]; rowCount: number }>();
  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  getEmp(id: string) {
    return this.http.get<{
      _id: string;
      fname: string;
      lname: string;
      age: number;
      email: string;
      company: string;
    }>(this.apiUrl + '/empList/' + id);
  }

  getEmployees(rowsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${rowsPerPage}&page=${currentPage}`;
    const url = this.apiUrl + '/empList';

    this.http
      .get<{ message: string; employees: any; maxRows: number }>(
        url + queryParams
      )
      .pipe(
        map((empData) => {
          return {
            emp: empData.employees.map((emp) => {
              return {
                fname: emp.fname,
                lname: emp.lname,
                age: emp.age,
                email: emp.email,
                company: emp.company,
                id: emp._id,
              };
            }),
            maxRows: empData.maxRows,
          };
        })
      )
      .subscribe(
        (dataEmp) => {
          this.emp = dataEmp.emp;
          this.empUpdated.next({
            emp: [...this.emp],
            rowCount: dataEmp.maxRows,
          });
        },
        (error) => {
          console.log(error);
        },
        () => {}
      );
  }

  createMember(
    fname: string,
    lname: string,
    age: number,
    email: string,
    company: string
  ) {
    const url = this.apiUrl + '/empList';
    const employee: Employee = {
      id: null,
      fname: fname,
      lname: lname,
      age: age,
      email: email,
      company: company,
    };

    this.http
      .post<{ message: string; emp: Employee }>(url, employee)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }
  getEmpUpdateListener() {
    return this.empUpdated.asObservable();
  }

  updateMember(
    id: string,
    fname: string,
    lname: string,
    age: number,
    email: string,
    company: string
  ) {
    let empData: Employee | FormData;

    const employee: Employee = { id, fname, lname, age, email, company };

    empData = {
      id: id,
      fname: fname,
      lname: lname,
      age: age,
      email: email,
      company: company,
    };
    console.log(empData, employee);
    this.http
      .put(this.apiUrl + '/empList/' + id, empData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }
  deleteEmp(empId: string) {
    const url = this.apiUrl + '/empList/';
    return this.http.delete(url + empId);
  }
}
