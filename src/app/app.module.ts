import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';

import { MenuComponent } from './menu/menu.component';
import { PomodoroListComponent } from './pomodoro-list/pomodoro-list.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './helpers/auth.guard';

import {TimeConvertPipe} from './shared/time-convertor.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    MenuComponent,
    PomodoroListComponent,
    TimeConvertPipe,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'timer', component: TimerComponent, canActivate: [AuthGuard] },
      { path: 'list', component: PomodoroListComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent},
      { path: 'home', component: HomeComponent},
      { path: '', redirectTo: '/timer', pathMatch: 'full' }
    ]),
    BrowserAnimationsModule,
    SocialLoginModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '109487263740-0dbm3d6n539rsodhtooejgcd0nvlprlm.apps.googleusercontent.com'
          ),
        }
      ],
    } as SocialAuthServiceConfig,
  },
  AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
