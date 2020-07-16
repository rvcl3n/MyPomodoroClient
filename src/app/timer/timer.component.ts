import { Component, OnInit } from '@angular/core';
import { timer, interval, fromEvent, merge, empty, Subject } from 'rxjs';
import { take, switchMap, mapTo, startWith, scan, takeWhile, repeatWhen, tap } from 'rxjs/operators';
import { RepositoryService } from './../shared/services/repository.service';
import {PomodoroForCreation} from '../_interfaces/pomodoro-for-creation.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  clickMessage = '';
  leftTime = 1500;
  startButtonText = "Start";
  startwithFlag = false;
  description ='';

  pauseButton : HTMLElement;
  resumeButton : HTMLElement;

  private readonly _start = new Subject<void>();

  constructor(private repository: RepositoryService) { 
  }

  ngOnInit(): void {
    this.pauseButton = document.getElementById('pauseButton');
    this.resumeButton = document.getElementById('startButton');

    const interval$ = interval(1000).pipe(mapTo(-1));
    const pause$ = fromEvent(this.pauseButton, 'click')
    .pipe(
      mapTo(false),
      tap(v => {
        this.startButtonText = "Continue";
      }
      ));
    const resume$ = fromEvent(this.resumeButton, 'click').pipe(mapTo(true));

    const timer$ = merge(pause$, resume$)
      .pipe(
      startWith(true),
      switchMap(val => (val ? interval$ : empty())),
      scan((acc, curr) => (curr ? curr + acc : acc), this.leftTime),
      takeWhile(v => v >= 0 && this.startwithFlag===true),
      tap(v => {if(v===0) this.startButtonText = "Restart"}),
      repeatWhen(() => this._start)
    )
    .subscribe((val: any) => (this.leftTime = val));
  }

  StartTimer(): void {
    if(this.leftTime === 0){
      this.leftTime = 1500;
      this.startwithFlag = true;
      this._start.next();
    }
    else if (this.leftTime === 1500){
      this.startwithFlag = true;
      this._start.next();
      const apiUrl = 'api/pomodoro';

      const pomodoro: PomodoroForCreation = {
        startTime: new Date().toString(),
        description: this.description
      }

      this.repository.create(apiUrl,pomodoro).subscribe(res => {
        localStorage.setItem('PomodoroId', res.toString());
      },
      (error => {
        console.log(error);
      }));
    }
    
  }

  doTextareaValueChange(ev) {
    try {
      this.description = ev.target.value;
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

}
