import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { ToDos } from 'src/app/interface/to-dos';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit, OnDestroy {

  public todos: ToDos[] = [];
  public secondTodos: ToDos[] = [];
  public todoText = new FormControl('');
  public editToDoText = new FormControl('');
  public editIput?: ToDos;

  private readonly unSubscribe$$ = new Subject<void>();

  constructor(private readonly service: BackendService,
    private readonly cdr: ChangeDetectorRef) { 
    console.log(service.userId);
  }

  ngOnInit(): void {
    this.service.getToDosUser$()
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data.todos);
      this.todos = data.todos;
      this.cdr.detectChanges();
    });
  }

  public deleteToDo(id: number) {
    this.service.deleteToDo$(id)
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data);
    });
    this.todos = this.todos.filter((data) => data.id !== id);
    console.log(this.todos);
  }

  public addToDo() {
    let num = 0;
    this.service.getToDos$()
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      num = data.total;
    });
    const body = {
      id: num,
      todo: this.todoText.value,
      completed: false,
      userId: this.service.userId
    }
    this.service.addToDo$(body)
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data);
    });
    this.secondTodos.push(body);
    this.todoText.setValue("");
  }

  public editToDo(id: number) {
    this.editIput = this.todos.find((data) => data.id == id);
    console.log(this.editIput);
    this.editToDoText.setValue(this.editIput?.todo);
  }

  public saveEditToDo() {
    this.service.editToDo$(this.editToDoText.value, this.editIput!.id)
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data);
    });
    this.todos.map((data) => {if(data.id == this.editIput?.id){data.todo = this.editToDoText.value}})
  }

  public ngOnDestroy(): void {
    this.unSubscribe$$.next();
    this.unSubscribe$$.complete();
  }
}
