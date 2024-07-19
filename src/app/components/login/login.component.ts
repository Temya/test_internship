import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy{

  public formLogin = this.fb.group({
    login: this.fb.control("", Validators.required),
    password: this.fb.control("", Validators.required)
  });

  private readonly unSubscribe$$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder,
    private readonly router: Router, 
    private readonly service: BackendService,
    private readonly cdr: ChangeDetectorRef) {   }

  ngOnInit(): void {
    this.service.getUsers$()
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => {
      console.log(data);
    });
  }

  public goReg() {
    this.router.navigateByUrl("registration");
  }

  public auth() {
    this.service.checkAuth$(this.formLogin.get("login")?.value, this.formLogin.get("password")?.value)
    .pipe(takeUntil(this.unSubscribe$$))
    .subscribe((data) => 
      {        
        if(data) 
        {      
          this.service.userId = data.id;    
          this.router.navigateByUrl("main");
        }
        else 
        {
          console.log("Invalid login or password");
        }
        this.cdr.detectChanges();       
      }
    )
  }

  public ngOnDestroy(): void {
    this.unSubscribe$$.next();
    this.unSubscribe$$.complete();
  }
}
