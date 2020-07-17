import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
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
}