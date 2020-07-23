import { Injectable } from '@angular/core';
import { UserForCreation } from 'src/app/_interfaces/user-for-creation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { of, Observable, Subject } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class AuthService {

    currentUser: Subject<UserForCreation> = new Subject<UserForCreation>();
    islogged: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient) {}
    
    login(user: UserForCreation): Observable<boolean> {
        this.currentUser.next(user);
        return this.http.post<any>(`${environment.urlAddress}/api/user/login`, user)
        .pipe(
            tap(() => this.doLogin(user.externalId)),
            mapTo(true),
            catchError(error => {
                alert(error.error);
                return of(false);
        }));
    }
    
    logout(){
        this.removeUserId();
        this.islogged.next(false);
    }
    
    isLoggedIn(): boolean {
        return !!this.getUserId();
    }

    private doLogin(id: string)
    {
        this.setUserId(id);
        this.islogged.next(true);
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