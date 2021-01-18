import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMsg } from '../errorMsg';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  fname: string;
  lname: string;
  age: number ;
  email: string;
  company: string;
  fnStyle: string;
  lnStyle: string;
  ageStyle: string;
  emailStyle: string;
  compStyle: string;
  employee: Employee;
  registerForm: FormGroup; // used Reactive Forms
  errorMsg = new ErrorMsg();
  private empSub: Subscription;
  private postsUpdated = new Subject<Employee[]>();
  private mode = 'create';
  private empId: string;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public EmployeeService: EmployeeService,
    public route: ActivatedRoute
    ) {
    this.registerForm = this.fb.group({
      fname: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z.-\\s\']*[a-zA-Z]$'),
        Validators.maxLength(250)
      ]),
      lname: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z.-\\s\']*[a-zA-Z]$'),
        Validators.maxLength(250)
      ]),
      age: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.maxLength(3)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^[a-zA-Z0-9_\\-.!#$%&*+-/=?^_{|}~\']+@[a-zA-Z0-9\\-]+\\.[a-zA-Z0-9\\-.]+$'
        ),
        Validators.maxLength(250)
      ]),
      company: new FormControl('', Validators.required),
    });

  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('empId')) {
        this.mode = 'edit';
        this.empId = paramMap.get('empId');
        this.isLoading = true;
        this.EmployeeService.getEmp(this.empId).subscribe(empData => {
          this.isLoading = false;
          this.employee = {
            id: empData._id,
            fname: empData.fname,
            lname: empData.lname,
            age: empData.age,
            email: empData.email,
            company: empData.company
          };
          console.log(this.employee);
          this.registerForm.patchValue({
            fname: this.employee.fname,
            lname: this.employee.lname,
            age: this.employee.age,
            email: this.employee.email,
            company: this.employee.company
          });
        });
      } else {
        this.mode = 'create';
        this.empId = null;
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.registerForm.controls.fname.status === 'INVALID'
      || this.registerForm.controls.lname.status === 'INVALID'
      || this.registerForm.controls.email.status === 'INVALID'
      || this.registerForm.controls.age.status === 'INVALID'
      || this.registerForm.controls.company.status === 'INVALID') {
        if (this.registerForm.controls.fname.status === 'INVALID') {
          this.errorMsg.valid = false;
          this.errorMsg.message += '\nWe need your first name.';
          this.errorMsg.type = 'fname';
          this.fnStyle = 'error-msg';
        }

        if (this.registerForm.controls.lname.status === 'INVALID') {
          this.errorMsg.valid = false;
          this.errorMsg.message += '\nWe need your last name.';
          this.errorMsg.type = 'lname';
          this.lnStyle = 'error-msg';
        }

        if (this.registerForm.controls.age.status === 'INVALID') {
          this.errorMsg.valid = false;
          this.errorMsg.message += '\nPlease enter a valid age';
          this.errorMsg.type = 'age';
          this.ageStyle = 'error-msg';
        }

        if (this.registerForm.controls.email.status === 'INVALID') {
          this.errorMsg.valid = false;
          this.errorMsg.message += '\nUh-oh, looks like an invalid email address was entered.';
          this.errorMsg.type = 'email';
          this.emailStyle = 'error-msg';
        }


        if (this.registerForm.controls.company.status === 'INVALID') {
          this.errorMsg.valid = false;
          this.errorMsg.message += '\nPlease Select the company';
          this.errorMsg.type = 'company';
          this.compStyle = 'error-msg';
        }

      } else {
        if (this.registerForm.valid) {
          console.log('all form validation passed');

          console.log(this.registerForm.value.fname,
            this.registerForm.value.lname,
            this.registerForm.value.age,
            this.registerForm.value.email,
            this.registerForm.value.company);
          if (this.mode === 'create') {
           this.EmployeeService.createMember(
            this.registerForm.value.fname,
            this.registerForm.value.lname,
            this.registerForm.value.age,
            this.registerForm.value.email,
            this.registerForm.value.company);
          } else {
            this.EmployeeService.updateMember(
              this.empId,
              this.registerForm.value.fname,
              this.registerForm.value.lname,
              this.registerForm.value.age,
              this.registerForm.value.email,
              this.registerForm.value.company);
          }

        } else {
          return;
        }
      }

  }

}
