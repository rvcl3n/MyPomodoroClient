import { Component, OnInit } from '@angular/core';
import { interval, fromEvent, merge, empty, Subject, pipe } from 'rxjs';
import { switchMap, mapTo, startWith, scan, takeWhile, repeatWhen, tap, map } from 'rxjs/operators';
import { RepositoryService } from './../shared/services/repository.service';
import { PomodoroForCreation } from '../_interfaces/pomodoro-for-creation.model';
import { Pomodoro } from '../_interfaces/pomodoro.model';
import { Title } from "@angular/platform-browser";
import { TimeConvertPipe } from './../shared/time-convertor.pipe';

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

  constructor(private repository: RepositoryService, private titleService: Title, private timeConvertPipe: TimeConvertPipe) {
    this.titleService.setTitle("Pomodoro Timer");
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
      tap(v => {
        if(v===0){
         this.startButtonText = "Restart";
         this.finishPomodoro();
        }
      }),
      repeatWhen(() => this._start)
    )
    .subscribe((val: any) => {this.leftTime = val;this.SetTitleValue();});

    if(localStorage.getItem('PomodoroId') !== null)
      this.getPomodoro();
      debugger;
      this.currentPomodoro;
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

      this.createPomodoro();
    }
  }

  private createPomodoro()
  {
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
      console.log(error);
    }));
  }

  private getPomodoro()
  {
    const id = localStorage.getItem('PomodoroId');

    const apiUrl = `api/pomodoro/${id}`;

    this.repository.getData(apiUrl)
      .subscribe(res => {this.currentPomodoro = res as Pomodoro})
        /*
      let currnetDateSeconds : number = Math.round(new Date().getTime() / 1000);
      let currentPomodoroStartTime : number = Math.round(new Date(this.currentPomodoro.startTime).getTime() / 1000);
  
      this.leftTime = this.leftTime - (currnetDateSeconds - currentPomodoroStartTime);

      this.startwithFlag = true;
      this._start.next();*/
    

      /*let currnetDateSeconds : number = Math.round(new Date().getTime() / 1000);
      let currentPomodoroStartTime : number = Math.round(new Date(this.currentPomodoro.startTime).getTime() / 1000);
  
      this.leftTime = this.leftTime - (currnetDateSeconds - currentPomodoroStartTime);*/

      /*this.startwithFlag = true;
      this._start.next();*/
  };

  private finishPomodoro()
  {
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
      console.log(error);
    }));
  }

  doTextareaValueChange(ev) {
    try {
      this.description = ev.target.value;
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

  private SetTitleValue(){
    let titleTime = this.timeConvertPipe.transform(this.leftTime)
    this.titleService.setTitle(titleTime);
  }

}
