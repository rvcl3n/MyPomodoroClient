import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider }from 'angularx-social-login';
import { AuthService } from './../shared/services/authentication.service';
import { RepositoryService } from './../shared/services/repository.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private socioAuthServ: SocialAuthService, private authService: AuthService, private repository: RepositoryService) { }

  ngOnInit(): void {
  }

  signIn():void {
    const provider = GoogleLoginProvider.PROVIDER_ID;

    this.socioAuthServ.signIn(provider).then((res) => 
    {
      this.authService.login(res.id);
    })
  }

}
