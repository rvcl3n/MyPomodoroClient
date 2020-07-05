import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';

import { MenuComponent } from './menu/menu.component';
import { PomodoroListComponent } from './pomodoro-list/pomodoro-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    MenuComponent,
    PomodoroListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'timer', component: TimerComponent },
      { path: 'list', component: PomodoroListComponent },
      { path: '', redirectTo: '/timer', pathMatch: 'full' }
    ]),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
