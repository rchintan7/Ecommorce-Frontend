import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Router } from '@angular/router';
import { CommonApisService } from 'src/app/shared/services/common-apis.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EmailPattern } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SettingsComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  formTypeQuick: FormGroup;
  profile: FormGroup;
  imagePreview1: string;
  imagePreview2: string;
  imagePreview3: string;
  imagePreview4: string;
  categories: any[] = [];
  userType: Array<string> = [];
  selectedTab = 1;
  submitted = false;
  userTypeErrorMessage = '';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private commonApisService: CommonApisService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profile = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(EmailPattern)]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
    this.fetchCategories();
    this.fetchProfile();
  }

  selectTab(tabId: number): void {
    this.staticTabs.tabs[tabId].active = true;
  }

  tabChange(index): void {
    this.selectedTab = index;
  }

  onImagePicked(event: Event, image: number): void {
    const file = (event.target as HTMLInputElement).files[0];
    if (
      !(
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      )
    ) {
      document.getElementById('errorMessageSection').style.display = 'block';
      document.getElementById('errorMessage').innerHTML =
        'Įkelkite galiojantį vaizdo failą.';
      return;
    } else if (file.size > 10000000) {
      document.getElementById('errorMessageSection').style.display = 'block';
      document.getElementById('errorMessage').innerHTML =
        'Didžiausias įkeliamo failo dydis - 10 mb';
      return;
    }
    document.getElementById('errorMessageSection').style.display = 'none';
    const reader = new FileReader();
    if (image === 1) {
      this.formTypeQuick.patchValue({ image1: file });
      this.formTypeQuick.get('image1').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview1 = reader.result as string;
      };
    } else if (image === 2) {
      this.formTypeQuick.patchValue({ image2: file });
      this.formTypeQuick.get('image2').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview2 = reader.result as string;
      };
    } else if (image === 3) {
      this.formTypeQuick.patchValue({ image3: file });
      this.formTypeQuick.get('image3').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview3 = reader.result as string;
      };
    } else if (image === 4) {
      this.formTypeQuick.patchValue({ image4: file });
      this.formTypeQuick.get('image4').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview4 = reader.result as string;
      };
    }
    reader.readAsDataURL(file);
  }

  fetchCategories(): void {
    this.commonApisService.fetchCategories().subscribe(
      (res) => {
        if (res.success) {
          this.categories = res.data;
        }
      },
      (error) => {
       console.log(`Fetch Category Api Error ${error}`);
      }
    );
  }

  fetchProfile(): void {
    this.commonApisService.fetchProfile().subscribe(
      (response) => {
        if (response.success) {
          this.userType =
          response.data.userType !== undefined &&
          response.data.userType !== null &&
          response.data.userType !== ''
              ? response.data.userType.split(',')
              : [];
          this.profile.patchValue({
            name: response.data.name,
            email: response.data.email,
            address: response.data.address,
            phone: response.data.phone,
          });
        }
      },
      (error) => {
       console.log(`Fetch Profile Api Error ${error}`);
      }
    );
  }

  showMore(categorySlug: string): void {
    this.commonApisService.redirectToCategory(categorySlug);
  }

  checkElementExist(element): boolean {
    return this.userType.includes(element);
  }

  isChecked(isChecked, element): void {
    if (isChecked) {
      this.userType.push(element);
    } else {
      const elementIndex = this.userType.findIndex((ele) => ele === element);
      if (elementIndex > -1) {
        this.userType.splice(elementIndex, 1);
      }
    }
    if (this.userType.length !== 0) {
      this.userTypeErrorMessage = '';
    }
  }
  updateProfile(): boolean {
    this.submitted = true;
    if (this.profile.invalid) {
      return false;
    }
    if (this.userType.length === 0) {
      this.userTypeErrorMessage = 'Pasirinkite bent vieną vartotojo tipą';
      return false;
    }
    const data = {
      ...this.profile.value,
      ...{ userType: this.userType.toString() },
    };
    this.authService.updateProfile(data).subscribe(
      (response) => {
        if (response.success) {
          this.submitted = false;
          this.authService.sucessMessage(response.message);
          this.fetchProfile();
        } else {
          this.authService.errorMessage(response.message);
        }
      },
      (error) => {
       console.log(`Update Profile Api Error ${error}`);
      }
    );
  }
}
