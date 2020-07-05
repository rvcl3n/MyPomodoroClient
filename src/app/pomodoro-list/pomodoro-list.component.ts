import { Component, OnInit } from '@angular/core';
import { RepositoryService } from './../shared/services/repository.service';
import { Pomodoro } from './../_interfaces/pomodoro.model';

@Component({
  selector: 'app-pomodoro-list',
  templateUrl: './pomodoro-list.component.html',
  styleUrls: ['./pomodoro-list.component.scss']
})
export class PomodoroListComponent implements OnInit {
  public pomodoros: Pomodoro[];
  public errorMessage: string = '';

  constructor(private repository: RepositoryService) {
   }

  ngOnInit(): void {
    this.getAllPomodoros();
  }

  public getAllPomodoros = () => {
    let apiAddress: string = "api/pomodoro";
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.pomodoros = res as Pomodoro[];
    },
    (error) => {
    })
  }

}
