import { Component, OnInit } from '@angular/core';
import { interval, fromEvent, merge, empty, Subject, pipe } from 'rxjs';
import { switchMap, mapTo, startWith, scan, takeWhile, repeatWhen, tap, map } from 'rxjs/operators';
import { RepositoryService } from './../shared/services/repository.service';
import { PomodoroForCreation } from '../_interfaces/pomodoro-for-creation.model';
import { Pomodoro } from '../_interfaces/pomodoro.model';
import { Title } from "@angular/platform-browser";
import { TimeConvertPipe } from './../shared/time-convertor.pipe';
import { ErrorHandlerService } from './../shared/services/error-handler.service';

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

  currentPomodoro : Pomodoro;

  pauseButton : HTMLElement;
  resumeButton : HTMLElement;

  private readonly _start = new Subject<void>();

  constructor(private repository: RepositoryService, private titleService: Title, private timeConvertPipe: TimeConvertPipe, private errorHandler: ErrorHandlerService) {
    this.titleService.setTitle("Pomodoro Timer");
  }

  ngOnInit(): void {

    if(localStorage.getItem('PomodoroId') !== null)
      this.getPomodoro();
      else
      this.setupTimer();
  }

  startTimer(): void {
    if (this.leftTime === 0){
      this.leftTime = 1500;
      this.startwithFlag = true;
      this._start.next();
    }
    else if (this.leftTime === 1500){
      this.startwithFlag = true;
      this._start.next();

      this.createPomodoro();
    }
  }

  private createPomodoro(): void {
    const id = localStorage.getItem('UserId');

    const apiUrl = `api/pomodoro/${id}`;

    const pomodoro: PomodoroForCreation = {
      startTime: new Date().toString(),
      description: this.description
    }

    this.repository.create(apiUrl,pomodoro).subscribe(res => {
      localStorage.setItem('PomodoroId', res.toString());
      localStorage.setItem('IsPaused', String(false));
    },
    (error => {
      this.errorHandler.handleError(error);
    }));
  }

  private getPomodoro(): void {
    const id = localStorage.getItem('PomodoroId');

    const apiUrl = `api/pomodoro/${id}`;

    this.repository.getData(apiUrl)
      .subscribe(res => {
        this.currentPomodoro = res as Pomodoro;

        let currnetDateSeconds : number = Math.round(new Date().getTime() / 1000);
        let currentPomodoroStartTime : number = Math.round(new Date(this.currentPomodoro.startTime).getTime() / 1000);

        if (currnetDateSeconds - currentPomodoroStartTime < this.leftTime)
        {
          this.leftTime = this.leftTime - (currnetDateSeconds - currentPomodoroStartTime);
          this.description = this.currentPomodoro.description;
        }
        else {
          localStorage.removeItem('PomodoroId');
        }
        
        this.setupTimer();
         
        this.startwithFlag = true;
        this._start.next();
      },
      error => {
        this.errorHandler.handleError(error);
      });
  };

  private finishPomodoro(): void {
    const pomodoroId = localStorage.getItem('PomodoroId');

    const apiUrl = `api/pomodoro/${pomodoroId}`;

    const pomodoro = {
      finishTime: new Date().toString(),
      description: this.description
    }

    this.repository.update(apiUrl,pomodoro).subscribe(res => {
      localStorage.removeItem('PomodoroId');
    },
    (error => {
      this.errorHandler.handleError(error);
    }));
  }

  doTextareaValueChange(ev): void {
    try {
      this.description = ev.target.value;
    } catch(error) {
      this.errorHandler.handleError(error);
    }
  }

  updateNote(): void {
    const pomodoroId = localStorage.getItem('PomodoroId');

    const apiUrl = `api/pomodoro/${pomodoroId}`;

    const pomodoro = {
      description: this.description
    }

    this.repository.update(apiUrl,pomodoro).subscribe(res => {},
    error => {
      debugger;
      this.errorHandler.handleError(error);
    });
  }

  private SetTitleValue(): void {
    let titleTime = this.timeConvertPipe.transform(this.leftTime)
    this.titleService.setTitle(titleTime);
  }

  private setupTimer(): void {
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
      tap(v => {
        if(v===0){
         this.startButtonText = "Restart";
         this.finishPomodoro();
        }
      }),
      repeatWhen(() => this._start)
    )
    .subscribe((val: any) => 
    {this.leftTime = val;this.SetTitleValue();},
    (error => {this.errorHandler.handleError(error);
    }));
  }
}
