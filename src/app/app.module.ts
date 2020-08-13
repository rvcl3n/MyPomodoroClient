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
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';

import { MenuComponent } from './menu/menu.component';
import { PomodoroListComponent } from './pomodoro-list/pomodoro-list.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './helpers/auth.guard';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';

import { TimeConvertPipe } from './shared/time-convertor.pipe';
import { NotificationDialogComponent } from './shared/modals/notification-dialog/notification-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    MenuComponent,
    PomodoroListComponent,
    TimeConvertPipe,
    LoginComponent,
    HomeComponent,
    InternalServerComponent,
    NotFoundComponent,
    NotificationDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'timer', component: TimerComponent, canActivate: [AuthGuard] },
      { path: 'list', component: PomodoroListComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent},
      { path: 'home', component: HomeComponent},
      { path: '404', component: NotFoundComponent},
      { path: '500', component: InternalServerComponent },
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
    MatTooltipModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule 
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
  AuthGuard,
  TimeConvertPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
