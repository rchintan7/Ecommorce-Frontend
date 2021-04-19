import { Component, OnInit } from '@angular/core';
import  { FormGroup,FormBuilder, Validators} from '@angular/forms';
import { NonAuthApiServiceService } from '../non-auth-api-service.service';
import { EmailPattern } from 'src/app/shared/models/constants';
import { Router} from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailPattern = EmailPattern;
  resetPassworsSubmitted:boolean = false; 
  forgotPasswordSubmitted:boolean = false;
  verifyOtpSubmitted:boolean  = false;
  verifyOtpForm:FormGroup;
  resetPasswordForm:FormGroup;
  forgotPasswordForm:FormGroup;
  errorMessage:string ="";   
  step:number = 0;
  userId:number = 0;
  constructor(
    private router:Router,
    private formBuilder:FormBuilder,
    private nonAuthApiServiceService :NonAuthApiServiceService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm =  this.formBuilder.group({
        email:['',[Validators.required,Validators.pattern(this.emailPattern)]]
    });
    this.verifyOtpForm =  this.formBuilder.group({
      otp:['',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]]
    });
    this.resetPasswordForm =  this.formBuilder.group({
      password:['',[Validators.required]],
      confirmPassword:['',[Validators.required]]
  },{validator: this.checkPasswords });
  }

	checkPasswords(group: FormGroup) { 
		let password = group.get('password').value;
		let confirmPassword = group.get('confirmPassword').value;
		return  password === confirmPassword ? null : { mustMatch: true }; 
	}
  forgotPassword():void {
    this.forgotPasswordSubmitted = true;
    if(this.forgotPasswordForm.invalid) {
      return ;  
    }
    this.nonAuthApiServiceService.forgotPassword(this.forgotPasswordForm.value).subscribe((response) => { 
      if(response.success) {
          this.nonAuthApiServiceService.sucessMessage(response.message);
          this.step = 1;
          this.errorMessage = "";
          this.userId = response.data.id;
      }
      else {
        this.errorMessage = response.message;
      } 
    });
  }

  verifyOtp():void {
    this.verifyOtpSubmitted = true;
    if(this.verifyOtpForm.invalid) {
      return ;  
    }
    this.nonAuthApiServiceService.verifyOtp(this.verifyOtpForm.value).subscribe((response)=>{
      if(response.success) {
          this.nonAuthApiServiceService.sucessMessage(response.message);
          this.step = 2;
          this.errorMessage = "";
      }
      else {
        this.errorMessage = response.message;
      } 
    });
  }


  resendOtp():void {
    this.nonAuthApiServiceService.resendOtp({id:this.userId}).subscribe((response)=>{
      if(response.success) {
          this.nonAuthApiServiceService.sucessMessage(response.message);
          this.errorMessage = "";
      }
      else {
        this.errorMessage = response.message;
      } 
    });
  }

  resetPassword():void {
    this.resetPassworsSubmitted = true;
    if(this.resetPasswordForm.invalid) {
      return ;  
    }
    const data = {...{user_id:this.userId},...{user_password:this.resetPasswordForm.value.password}};
    this.nonAuthApiServiceService.resetPassword(data).subscribe((response)=>{
      if(response.success) {
          this.nonAuthApiServiceService.sucessMessage(response.message);
          this.router.navigateByUrl("/prisijungti");
      }
      else {
        this.errorMessage = response.message;
      } 
    });
  }
}
