import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnDestroy {

  public formReg = this.fb.group({
    login: this.fb.control("", Validators.required),
    password: this.fb.control("", Validators.required),
    confirmPass: this.fb.control("", Validators.required),
    email: this.fb.control("", Validators.required)
  });

  private readonly unSubscribe$$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder, 
    private readonly router: Router, 
    private readonly service: BackendService,
    private readonly cdr: ChangeDetectorRef) { }

  public goLog() {
    this.router.navigateByUrl("");
  }

  public regNewUser(): void {
    if(this.formReg.valid){
      if(this.formReg.get("password")?.value == this.formReg.get("confirmPass")?.value){
        const body = {
          username:   this.formReg.get("login")?.value,
          password: this.formReg.get("password")?.value,
          email: this.formReg.get("email")?.value
        }
        this.service.regNewUser$(body)
        .pipe(takeUntil(this.unSubscribe$$))
        .subscribe((data) => {
          console.log(data);
          this.cdr.detectChanges();
        });
        console.log("Registration successful");
      }
      else{
        console.log("confirmPass");
      }
    }
    else{
      console.log("Form invalid")
    }
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.unSubscribe$$.next();
    this.unSubscribe$$.complete();
  }
}
