import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider }from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private socioAuthServ: SocialAuthService) { }

  ngOnInit(): void {
  }

  signIn():void {
    const provider = GoogleLoginProvider.PROVIDER_ID;

    this.socioAuthServ.signIn(provider).then((res) => 
    {
      localStorage.setItem('UserId', res.id);
    })
  }

}
