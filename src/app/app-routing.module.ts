import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent} from './components/login/login.component';
import { RegistrationComponent} from './components/registration/registration.component';

const routes: Routes = [
    {path: "", component: LoginComponent},
    {path: "main", component: MainPageComponent},
    {path: "registration", component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
