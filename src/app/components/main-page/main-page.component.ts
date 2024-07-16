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
  public todotext = new FormControl('');
  public edittodotext = new FormControl('');
  public state = true;
  public editToDo: any;

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

  public delToDo(id: number) {
    this.service.deleteToDo$(id)
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data);
      this.cdr.detectChanges();
    });
    this.todos = this.todos.filter((data) => data.id != id);
    console.log(this.todos);
  }

  public addToDo() {
    let num = 0;
    this.service.getToDos$()
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      num = data.total;
      this.cdr.detectChanges();
    });
    const body = {
      id: num,
      todo: this.todotext.value,
      completed: false,
      userId: this.service.userId
    }
    this.service.addToDo$(body)
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data);
      this.cdr.detectChanges();
    });
    this.secondTodos.push(body);
    this.todotext.setValue("");
  }

  public edToDo(id: number) {
    this.state = false;
    this.editToDo = this.todos.find((data) => data.id == id);
    console.log(this.editToDo);
    this.edittodotext.setValue(this.editToDo.todo);
  }

  public saveEditToDo() {
    this.service.editToDo$(this.edittodotext.value, this.editToDo.id)
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data);
      this.cdr.detectChanges()
    ;});
    this.todos.map((data) => {if(data.id == this.editToDo.id){data.todo = this.edittodotext.value}})
    this.state = true;
  }

  public ngOnDestroy(): void {
    this.unSubscribe$$.next();
    this.unSubscribe$$.complete();
  }
}
