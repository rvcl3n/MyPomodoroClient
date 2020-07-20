import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class AuthService {

    constructor() {}
    
    login(id: string){
        this.setUserId(id);
    }
    
    logout(){
        this.removeUserId();
    }
    
    isLoggedIn(): boolean {
        return !!this.getUserId();
    }
    
    private getUserId(): string {
         return localStorage.getItem('UserId');
    }

    private setUserId(id: string) {
        localStorage.setItem('UserId', id);
    }

    private removeUserId(){
        localStorage.removeItem('UserId');
    }
}