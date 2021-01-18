import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeDetailsComponent } from './employee/employee-details/employee-details.component';
import { EmployeeRegisterComponent } from './employee/employee-register/employee-register.component';


const routes: Routes = [
  { path: '', component: EmployeeRegisterComponent },
{ path: 'create', component: EmployeeDetailsComponent },
{ path: 'edit/:empId', component: EmployeeDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
