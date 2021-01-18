import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';

import { Employee } from '../employee';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
})
export class EmployeeRegisterComponent implements OnInit, OnDestroy {
  employeeList: Employee[] = [];
  private empSub: Subscription;

  detailForm: FormGroup;
  isLoading = false;
  totalPosts = 0;
  rowsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  sizes: string;
  loc: string;
  compnames: string[];
  compList: any[] = [
    { name: 'Macrohard Corporation' , size: 'Large' , loc: 'Sydney' },
    { name: 'Acme Corporation' , size: 'Medium' , loc: 'Melbourne' },
    { name: 'Boogle' , size: 'Small' , loc: 'Brisbane' },
    { name: 'Tequila Mockingbird' , size: 'Large' , loc: 'Sydney' },
    { name: 'Amigone Funeral Home' , size: 'Medium' , loc: 'Melbourne' },
    { name: 'CXTX' , size: 'Small' , loc: 'Perth' },
    { name: 'CX Lavender' , size: 'Medium' , loc: 'Sydney' }
  ];
  filters = [];
  filtered = [];


  constructor(
    public EmployeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
    ) {
      this.detailForm = this.fb.group({});
    }

  ngOnInit() {
    this.isLoading = true;
    this.EmployeeService.getEmployees(this.rowsPerPage, this.currentPage);
    this.empSub = this.EmployeeService
      .getEmpUpdateListener()
      .subscribe((empData: { emp: Employee[], rowCount: number}) => {
        this.isLoading = false;
        this.totalPosts = empData.rowCount;
        this.employeeList = empData.emp;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.rowsPerPage = pageData.pageSize;
    this.EmployeeService.getEmployees(this.rowsPerPage, this.currentPage);
  }

  onCreate() {
    this.router.navigate(['/create'], { relativeTo: this.route });
  }

  onDelete(empId: string) {
    this.isLoading = true;
    this.EmployeeService.deleteEmp(empId).subscribe(() => {
      this.EmployeeService.getEmployees(this.rowsPerPage, this.currentPage);
    });
  }
  applyFilter(event) {
    let keyword = event;

    console.log(keyword);

    for (let i = 0 ; i < this.compList.length; i++) {
      if (this.compList[i].loc === keyword) {
        this.filters[i] = this.compList[i].name;
        console.log( this.filters[i]);
      }
    }
    // for (let i = 0; i < this.totalPosts; i++) {
    //   console.log(this.totalPosts);
    //   if (this.employeeList[i].company == this.filters[i]) {
    //     console.log(this.employeeList[i].company, this.filters[i]);
    //     this.filtered[i] = this.employeeList[i];
    //     console.log(this.filtered[i]);
    //   }
    // }
  //   for (let i = 0; i < this.filters.length; i++) {
  //   // this.filtered[i] = this.employeeList.filter(emp =>{
  //   //   return emp.company === this.filters[i]
  //   // });
  //   console.log(this.employeeList.filter(emp =>{
  //     return emp.company === this.filters[i]
  //   }));
  // }
  }

  ngOnDestroy() {
    this.empSub.unsubscribe();
  }
}
