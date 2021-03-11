import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CreateParkingLotComponent } from './create-parking-lot/create-parking-lot.component';
import { ParkingLotAnalysisComponent } from './parking-lot-analysis/parking-lot-analysis.component';

const routes: Routes = [
  {path:'',component:CreateParkingLotComponent, pathMatch: 'full'},
  {path:'parking-lot',component:ParkingLotAnalysisComponent,canActivate:[AuthGuard]},
  {path: '**', component: CreateParkingLotComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
