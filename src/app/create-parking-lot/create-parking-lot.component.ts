import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ParkingServiceService } from '../parking-service.service';

@Component({
  selector: 'app-create-parking-lot',
  templateUrl: './create-parking-lot.component.html',
  styleUrls: ['./create-parking-lot.component.css']
})
export class CreateParkingLotComponent implements OnInit {

parkingForm:FormGroup;
errBol=null;
errMessage;

  constructor( 
    private router:Router,
    private parkingService: ParkingServiceService
    ) {
    
  }

  ngOnInit(): void {
    this.parkingForm = new FormGroup({
      total: new FormControl(null),
      parked: new FormControl(null)
    })
  }

  createParking(){
    
    let total = this.parkingForm.value.total;
    let parked = this.parkingForm.value.parked;

    if(total<=0 ||total>10000 ){
      this.errBol=true;
      this.errMessage="Please enter valid numbers between 1-10000";
    }
   else if(total>=parked){
      // console.log(total,parked);
      this.errBol=false;

      this.parkingService.totalSlots = total;
      this.parkingService.parkedCars = parked;
      this.parkingService.populateSlots();
      this.parkingService.setLoggedin(true);
      this.router.navigate(['parking-lot']);
    }
    else if(total<parked){
      this.errBol=true;
      this.errMessage="Available slots should be more than parked cars";
    }
    
  }

}
