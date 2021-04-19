import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EmailPattern } from 'src/app/shared/models/constants';
import { Validators, FormGroup, FormBuilder} from '@angular/forms';
import { NonAuthApiServiceService } from 'src/app/modules/non-auth/non-auth-api-service.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class RegistrationComponent implements OnInit {

	emailPattern = EmailPattern;
	registrationForm: FormGroup;
	submitted = false;
	errorMessage = '';
	constructor(
		private nonAuthApiService: NonAuthApiServiceService,
		private formBuilder: FormBuilder,
		private router: Router,
	) { }

	ngOnInit(): void {
		this.registrationForm = this.formBuilder.group({
			role: ['2', Validators.required],
			userType: ['1', Validators.required],
			email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
			name: ['', Validators.required],
			phone: ['', Validators.required],
			password: ['', Validators.required]
		});
	}


	saveUser(): void {
		this.submitted = true;	
		if(this.registrationForm.invalid) {
			return;
		}
		this.nonAuthApiService.saveUser(this.registrationForm.value).subscribe((response) => {
			if (response.success) {
				this.nonAuthApiService.sucessMessage("Registracija pavyko. Galite prisijungti");
				this.router.navigateByUrl('prisijungti');
			} else {
				this.errorMessage = response.message;
			}
		}, (error) => {
			console.log(`Api failed of register  ${error}`);
		});
	}
} 
