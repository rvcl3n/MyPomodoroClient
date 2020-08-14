import { Component, OnInit, ViewChild } from '@angular/core';
import { RepositoryService } from './../shared/services/repository.service';
import { Pomodoro } from './../_interfaces/pomodoro.model';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-pomodoro-list',
  templateUrl: './pomodoro-list.component.html',
  styleUrls: ['./pomodoro-list.component.scss']
})
export class PomodoroListComponent implements OnInit {
  public pomodoros: Pomodoro[];
  public dataSource = new MatTableDataSource(this.pomodoros);
  public errorMessage: string = '';
  displayedColumns: string[] = ['id', 'startTime', 'finishTime', 'description'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService) {
   }

  ngOnInit(): void {
    this.getAllPomodoros();
  }

  public getAllPomodoros = () => {
    const id = localStorage.getItem('UserId');
    
    let apiAddress: string = `api/pomodoro/getbyuser/${id}`;
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.pomodoros = res as Pomodoro[];
      this.dataSource = new MatTableDataSource(this.pomodoros);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'startTime': return new Date(item.startTime);
          case 'finishTime': return new Date(item.finishTime);
          default: return item[property];
        }
      };
    },
    error => {this.errorHandler.handleError(error);
    })
  }

}
