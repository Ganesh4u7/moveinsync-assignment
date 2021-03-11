import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateParkingLotComponent } from './create-parking-lot/create-parking-lot.component';
import { ParkingLotAnalysisComponent } from './parking-lot-analysis/parking-lot-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateParkingLotComponent,
    ParkingLotAnalysisComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
