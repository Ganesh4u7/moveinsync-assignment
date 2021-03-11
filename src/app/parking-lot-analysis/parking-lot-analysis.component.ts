import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ParkingServiceService } from '../parking-service.service';

@Component({
  selector: 'app-parking-lot-analysis',
  templateUrl: './parking-lot-analysis.component.html',
  styleUrls: ['./parking-lot-analysis.component.css']
})
export class ParkingLotAnalysisComponent implements OnInit {

parkCarForm:FormGroup; 
searchForm:FormGroup; 
parkingLotDetails;
totalSlots;
parkedCars;
parkingSlots=[];
filterdParkingSlots=[];
paginationSlots=[];
parkingLogs=[];
totalFees =0;
freeSlots=[];
parkCarStatus=false;




page_number =1;
page_size=10;


tempSortType=null;

sortState =false;
sortTypeName =null;
sortTypeMode =null;
previousOrder = [];



  constructor( 
        private route: ActivatedRoute,
        private parkingService: ParkingServiceService
    ) { }

  ngOnInit(): void {
    this.parkCarForm = new FormGroup({
      carNo: new FormControl(null),
      color: new FormControl(null),
      slot: new FormControl(null)
    });

    this.searchForm = new FormGroup({
      carNo: new FormControl(''),
      color: new FormControl('default')
    });

   this.totalSlots = this.parkingService.totalSlots;
   
   this.getData();

  }

  deleteParkedCar(index){
    let numb = ((this.page_number-1)*10)+index;
    let slot = this.filterdParkingSlots[numb].slot;
    this.parkingService.removeCar(slot);
    let tempPageno =1 ;
    if(this.page_number>1){
      tempPageno = this.page_number;
    }
    this.getData();
    let carNo = this.searchForm.value.carNo.toUpperCase();
    let color = this.searchForm.value.color;
    if(carNo != null || carNo!=''|| color!='default'){
      this.filterdParkingSlots= this.parkingSlots.filter( (car)=>{
        console.log(car);
        if(color == 'default' && car.carNo.includes(carNo) ){
          
          return car;
        }
        else if(car.carNo.includes(carNo) && car.color == color){
          return car;
        }
      });
      
      this.paginationSlots = this.filterdParkingSlots.slice(0,10);
      this.page_number =1;
      this.sortTypeName = null;
    }
    if(this.sortState ){
      console.log(this.sortTypeMode,this.sortTypeName);
      this.page_number = tempPageno;
      if(this.sortTypeMode == 1){
        this.sortTypeMode =0;
        this.sortTypeName = this.tempSortType;
        this.sortParkedCars(this.tempSortType);
      }
      else if(this.sortTypeMode == -1){
        this.sortTypeMode = 1;
        this.sortTypeName = this.tempSortType;
        this.sortParkedCars(this.tempSortType);
      }
      else if(this.sortTypeMode == 0){
        this.sortTypeMode = -1;
        this.sortTypeName = this.tempSortType;
        this.sortParkedCars(this.tempSortType);
      }
      
    }
    if(tempPageno >1){
      console.log(tempPageno);
      if((tempPageno*this.page_size) <=this.filterdParkingSlots.length){
        let page_size=this.page_size;
        this.page_number =tempPageno;
        this.paginationSlots = this.filterdParkingSlots.slice((tempPageno - 1) * page_size, tempPageno * page_size);
        }
       else if((tempPageno*this.page_size) >=this.filterdParkingSlots.length){
          let page_size=this.page_size;
          this.page_number =tempPageno;
          this.paginationSlots = this.filterdParkingSlots.slice((tempPageno - 1) * page_size, tempPageno * page_size);
          }
    }
  }

  parkACar(){
    let carDetails = {
      carNo: this.parkCarForm.value.carNo.toUpperCase(),
      slot: this.parkCarForm.value.slot,
      color:this.parkCarForm.value.color,
      time: new Date()
    }
    console.log(carDetails.slot);

    this.parkingService.parkCar(carDetails);
    this.getData();
    this.parkCarForm.reset();
    this.parkCarStatus =true;

    setTimeout(()=>{
      this.parkCarStatus=false
    },2500);

  }

  getData(){
    this.parkingSlots = [...this.parkingService.parkingSlots];
    this.filterdParkingSlots =[...this.parkingService.parkingSlots];
    console.log(this.filterdParkingSlots.length);
    this.paginationSlots = this.filterdParkingSlots.slice(0,10);
    this.totalFees = this.parkingService.totalFees;
    this.parkedCars = this.parkingService.parkedCars;
    this.freeSlots = [...this.parkingService.freeSlots];
    this.parkingLogs = [...this.parkingService.parkingAnalysis];
    this.page_number =1;
    // console.log(this.parkingLogs);
  }

  searchCar(){
    let carNo = this.searchForm.value.carNo.toUpperCase();
    let color = this.searchForm.value.color;

     this.filterdParkingSlots= this.parkingSlots.filter( (car)=>{
      console.log(car);
      if(color == 'default' && car.carNo.includes(carNo) ){
        
        return car;
      }
      else if(car.carNo.includes(carNo) && car.color == color){
        return car;
      }
    });
    
    this.paginationSlots = this.filterdParkingSlots.slice(0,10);
    this.page_number =1;
    this.sortTypeName = null;

  }
  reset(){
    this.getData();
    this.searchForm.reset({
      carNo: '',
      color:'default'
    });
    this.sortTypeName=null;
    this.sortTypeMode=null;
    this.page_number=1;
    this.tempSortType = null;
    this.sortState = false;
  }

  sortParkedCars(sortType){

    if(sortType =='carNo'){
      this.tempSortType = sortType;
      if(this.sortTypeName!= 'carNo'){
        this.sortTypeMode = 0;
        this.previousOrder = [...this.filterdParkingSlots];
      }
      if(this.sortTypeMode == null || this.sortTypeMode == 0){
        this.filterdParkingSlots.sort((a, b) => {
          let fa = a.carNo.toLowerCase(),
              fb = b.carNo.toLowerCase();
      
          if (fa < fb) return -1;
          else if (fa > fb)  return 1;
          return 0;
      });
      this.ascending('carNo');

      }
     else if(this.sortTypeMode == 1  ){
        this.filterdParkingSlots.sort((a, b) => {
          let fa = a.carNo.toLowerCase(),
              fb = b.carNo.toLowerCase();
      
          if (fa < fb) return 1;
          else if (fa > fb)  return -1;
          return 0;
      });
      this.descending('carNo');

      }
     else if(this.sortTypeMode == -1){
        this.noSort('carNo');

      }
    }

    else if(sortType == 'color'){
      this.tempSortType = sortType;
      if(this.sortTypeName != 'color'){
        this.sortTypeMode = 0;
        this.previousOrder = [...this.filterdParkingSlots];
      }
      if(this.sortTypeMode == null || this.sortTypeMode == 0){
        console.log('hiii');
        this.filterdParkingSlots.sort((a, b) => {
          let fa = a.color.toLowerCase(),
              fb = b.color.toLowerCase();
      
          if (fa < fb) return -1;
          else if (fa > fb)  return 1;
          return 0;
      });
      this.ascending('color');

      }
      else if(this.sortTypeMode == 1){
        console.log('came here');
        this.filterdParkingSlots.sort((a, b) => {
          let fa = a.color.toLowerCase(),
              fb = b.color.toLowerCase();
      
          if (fa < fb) return 1;
          else if (fa > fb)  return -1;
          return 0;
      });
      this.descending('color');

      }
      else if( this.sortTypeMode == -1){
        this.noSort('color');
      }
    }

    else if(sortType == "slot"){
      this.tempSortType = sortType;
      if(this.sortTypeName!= 'slot'){
        this.sortTypeMode = 0;
        this.previousOrder = [...this.filterdParkingSlots];
      }
      if(this.sortTypeMode == null || this.sortTypeMode == 0){
        this.filterdParkingSlots.sort((a, b) => {
          if(a.slot < b.slot) return -1;
          else if(a.slot > b.slot) return 1;
          return 0;
       });
       this.ascending('slot');
      }
      else if(this.sortTypeMode == 1){
        this.filterdParkingSlots.sort((a, b) => {
          if(a.slot < b.slot) return 1;
          else if(a.slot > b.slot) return -1;
          return 0;
       });
       this.descending('slot');
      }
      else if( this.sortTypeMode == -1){
        this.noSort('slot');
      }
      
    }
    else if( sortType== "date"){
      this.tempSortType = sortType;
      if(this.sortTypeName!= 'date'){
        this.sortTypeMode = 0;
        this.previousOrder = [...this.filterdParkingSlots];
      }
      if(this.sortTypeMode == null || this.sortTypeMode == 0){
        this.filterdParkingSlots.sort((a, b) => {
          return a.time - b.time;
        });
        this.ascending('date');
      }
      else if(this.sortTypeMode == 1){
        this.filterdParkingSlots.sort((a, b) => {
          return b.time - a.time;
        });
        this.descending('date');
      }
      else if( this.sortTypeMode == -1){
        this.noSort('date');
      }
    }

  }

  next() {
    if((this.page_number)*10 <this.filterdParkingSlots.length){
    let page_size=10;
    this.page_number +=1;
    this.paginationSlots = this.filterdParkingSlots.slice((this.page_number - 1) * page_size, this.page_number * page_size);
    }
  }
  previous(){
    if((this.page_number-1)*10 >0){
      
    let page_size=10;
    this.page_number -=1;
    this.paginationSlots = this.filterdParkingSlots.slice((this.page_number - 1) * page_size, this.page_number * page_size);
 
    }
  }

  ascending(name){
      this.paginationSlots = this.filterdParkingSlots.slice((this.page_number - 1) * 10, this.page_number * 10);
        this.sortTypeMode =1;
        this.sortTypeName =name;
        this.sortState =true;
        // this.page_number =1;
  }
  descending(name){
        this.paginationSlots = this.filterdParkingSlots.slice((this.page_number - 1) * 10, this.page_number * 10);
        this.sortTypeMode =-1;
        this.sortTypeName =name;
        this.sortState =true;
        // this.page_number =1;
  }
  noSort(name){
    this.filterdParkingSlots =[...this.previousOrder];
    this.paginationSlots = this.filterdParkingSlots.slice((this.page_number - 1) * 10, this.page_number * 10);
    this.sortTypeMode = 0;
    this.sortTypeName =name;
    this.sortState =false;
  }
  numbPages(){
    let temp = this.filterdParkingSlots.length/10;
    return Math.ceil(temp);
  }

}
