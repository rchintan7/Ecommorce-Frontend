import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailPattern } from 'src/app/shared/models/constants';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class VoucherComponent implements OnInit {

  voucherForm: FormGroup;
  submitted = false;
  // loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private commonApisService: CommonApisService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.commonApisService.redirectToLogin();
    }
    this.voucherForm = this.formBuilder.group({
      recipient_name: ['', Validators.required],
      recipient_email: ['', [Validators.required, Validators.pattern(EmailPattern)]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]],
      voucher_type: ['Birthday', [Validators.required]],
      message: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      agree: [false, Validators.requiredTrue]
    });
  }

  onFormSubmit(): void {
    this.submitted = true;
    if (this.voucherForm.invalid) {
      return;
    }
    // this.loading = true;
    this.commonApisService.saveVoucher(this.voucherForm.value).subscribe(response => {
      // this.loading = false;
      if (response.success) {
        this.submitted = false;
        this.authService.sucessMessage(response.message);
        this.voucherForm.reset();
      }
      else {
        this.authService.errorMessage(response.message);
      }
    }, (error) => {
       console.log('Save voucher api error', error);
    });
  }
  onChange(value: string): void {
    this.voucherForm.patchValue({
      voucher_type: value
    });
  }
}
