import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../shared/services/authentication.service';
import { UserForCreation } from '../_interfaces/user-for-creation.model';
import { RepositoryService } from '../shared/services/repository.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  username: string;
  login: string = 'login';
  loginTooltip: string = 'Log in';
  user: UserForCreation;

  constructor(private router: Router, private authService: AuthService, private repository: RepositoryService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: UserForCreation) => {
      this.username = user.fullName;
    });
    this.authService.islogged.subscribe((islogged: boolean) =>{
      this.checkIfLoggedIn(islogged);
    });
    
    this.checkIfLoggedIn(this.authService.isLoggedIn());

    if(this.authService.isLoggedIn() && !this.username)
    {
      this.getUser();
    }
  }

  clickMenuItem(menuItem : string){

    if(menuItem === 'Timer'){
      this.router.navigate(['/timer']);
    }

    if(menuItem === 'List'){
      this.router.navigate(['/list']);
    }

    if(menuItem === 'Login'){
      this.router.navigate(['/login']);
    }
  }

  clickLoginButton(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    } else {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  private checkIfLoggedIn(loggedin: boolean){
    if(loggedin){
      this.login = 'logout';
      this.loginTooltip = 'Log out';
    } else {
      this.login = 'login';
      this.loginTooltip = 'Log in';
    }
  }

  private getUser()
  {
    const id = localStorage.getItem('UserId');
    let apiAddress: string = `api/user/external/${id}`;
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.user = res as UserForCreation;
      this.username = this.user.fullName;
    },
    (error) => {
    })
  }
}