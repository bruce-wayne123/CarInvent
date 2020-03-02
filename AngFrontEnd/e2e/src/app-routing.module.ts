import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import{AddCarComponent} from './add-car/add-car.component';

const routes: Routes = [

{path:'home',component:HomeComponent},
{path:'add-car',component:AddCarComponent},
{path: '', redirectTo: '/home', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }