import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider }from 'angularx-social-login';
import { AuthService } from './../shared/services/authentication.service';
import { RepositoryService } from './../shared/services/repository.service';
import { UserForCreation } from 'src/app/_interfaces/user-for-creation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private socioAuthServ: SocialAuthService, private authService: AuthService, private repository: RepositoryService, private router: Router) { }

  ngOnInit(): void {
  }

  signIn():void {
    const provider = GoogleLoginProvider.PROVIDER_ID;

    this.socioAuthServ.signIn(provider).then((res) => 
    {
      var user: UserForCreation = {
        externalId: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        fullName: res.name,
        email: res.email
      };
      this.authService.login(user)
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/timer']);
        }
      });
    })
  }

}
