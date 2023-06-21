import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/user.model';
import { ApiAuthService } from 'src/app/core/services/auth/api.auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  user: User | null = <User | null>{};
  isMenuCollapsed = true;
  languages = [
    "es",
    "en"
  ]
  selectedLanguage = "es"
  selectLanguageForm = new FormGroup({
    selectLanguage: new FormControl(this.languages[0])
  })
  

  constructor(
    private authService: ApiAuthService,
    private translateService: TranslateService
    ) {
    this.authService.user.subscribe(user => this.user = user)
    this.translateService.setDefaultLang(this.selectedLanguage);
      this.translateService.use(this.selectedLanguage);
    
  }
  ngOnInit(): void {
    this.selectLanguageForm.get('selectLanguage')?.valueChanges
    .subscribe(language => this.changeLanguage(language))
  }

  get isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  get isProfessor() {
    return this.user && this.user.role === 'professor';
  }

  get isStudent() {
    return this.user && this.user.role === 'student';
  }

  logout() {
    this.authService.logout();
    this.isMenuCollapsed = true;
  }

  changeLanguage(language: any) {
    this.translateService.use(language);
  }

}
