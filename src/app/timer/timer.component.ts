import { Component, OnInit } from '@angular/core';
import { timer, interval, fromEvent, merge, empty, Subject } from 'rxjs';
import { take, switchMap, mapTo, startWith, scan, takeWhile, repeatWhen, tap } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  clickMessage = '';
  leftTime = 10;
  startButtonText = "Start";
  startwithFlag = false;

  pauseButton : HTMLElement;
  resumeButton : HTMLElement;

  private readonly _start = new Subject<void>();

  constructor() { 
  }

  ngOnInit(): void {
    this.pauseButton = document.getElementById('pauseButton');
    this.resumeButton = document.getElementById('startButton');

    const interval$ = interval(1000).pipe(mapTo(-1));
    const pause$ = fromEvent(this.pauseButton, 'click').pipe(mapTo(false));
    const resume$ = fromEvent(this.resumeButton, 'click').pipe(mapTo(true));

    const timer$ = merge(pause$, resume$)
      .pipe(
      startWith(true),
      switchMap(val => (val ? interval$ : empty())),
      scan((acc, curr) => (curr ? curr + acc : acc), this.leftTime),
      takeWhile(v => v >= 0),
      tap(v => {if(v===0) this.startButtonText = "Restart"}),
      repeatWhen(() => this._start)
    )
    .subscribe((val: any) => (this.leftTime = val));
  }

  StartTimer(): void {
    if(this.leftTime === 0){
      this._start.next();
      this.leftTime = 10;
      this.startwithFlag = true;
    }
  }

  ClickButton(): void {
    this.clickMessage += 'Button was clicked';
  }

}
