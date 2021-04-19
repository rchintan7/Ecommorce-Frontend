import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EmailPattern } from 'src/app/shared/models/constants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NonAuthApiServiceService } from 'src/app/modules/non-auth/non-auth-api-service.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	encapsulation: ViewEncapsulation.None

})

export class LoginComponent implements OnInit {

	emailPattern = EmailPattern;
	loginForm: FormGroup;
	errorMessage = '';
	submitted = false;
	constructor(
		private nonAuthApiService: NonAuthApiServiceService,
		private formBulider: FormBuilder,
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.loginForm  = this.formBulider.group({
			email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
			password: ['', [Validators.required]]
		});
	}

	loginUser(): void {
		this.submitted = true;
		if (this.loginForm.invalid) {
			return;
		}
		this.errorMessage = '';
		this.nonAuthApiService.loginUser(this.loginForm.value).subscribe((response) => {
			if (response.success) {
				this.submitted = false;
				this.authService.saveAuthData(response.data);
				this.router.navigateByUrl('/');
			} else {
				this.errorMessage = response.message;
			}
		}, (error) => {
			this.errorMessage = 'Nepavyko prisijungti. Prašau, pabandykite dar kartą';
			console.log(`api failed of register ${error}`);
		});
	}
}

