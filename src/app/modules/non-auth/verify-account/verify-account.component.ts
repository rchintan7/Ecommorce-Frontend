import { Component, OnInit } from '@angular/core';
import { NonAuthApiServiceService } from 'src/app/modules/non-auth/non-auth-api-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-verify-account',
	templateUrl: './verify-account.component.html',
	styleUrls: ['./verify-account.component.scss']
})

export class VerifyAccountComponent implements OnInit {

	constructor(
		private nonAuthApiService: NonAuthApiServiceService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params: { token: string }) => {
			if (params.token !== undefined) {
				this.verifyToken(params.token);
			}
			else {
				this.nonAuthApiService.errorMessage(`Žetonas nerastas`);
			}
		});
	}

	verifyToken(token: string): void {
		this.nonAuthApiService.verifyToken({ token }).subscribe((response) => {
			if (response.success) {
				this.nonAuthApiService.sucessMessage(response.message);
				this.router.navigateByUrl('/prisijungti');
			}
			else {
				this.nonAuthApiService.errorMessage(response.message);
			}
		}, (error) => {
			console.log(`Verify Token APi errir ${error}`);
		});
	}
}
