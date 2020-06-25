import { Component, OnInit } from '@angular/core';
import { timer, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  clickMessage = '';
  leftTime = 3;

  constructor() { }

  ngOnInit(): void {
  }

  StartTimer(): void {
    const timerMessage = 'Time is up';

    const timerInterval = interval(1000);

    const source = timer(this.leftTime*1000);

    const times = this.leftTime;

    const countDown = timerInterval.pipe(take(times));

    const sub = countDown.subscribe(val =>this.leftTime = times - val-1);

    const subscribe = source.subscribe(() => 
    {
      alert(timerMessage);
      this.leftTime = 3;
    }
    );
  }


  ClickButton(): void {
    this.clickMessage += 'Button was clicked';
  }

}
