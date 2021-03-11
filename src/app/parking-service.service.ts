import { EventEmitter,Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParkingServiceService {

  stateChanged : EventEmitter<boolean> = new EventEmitter();

  private isLoggedin = false;

  public totalSlots=0;
  public parkedCars=0;
  public parkingSlots=[];
  public freeSlots=[];
  public parkingAnalysis = [];
  totalFees = 0;

  cars=[
    { carNo:'KA-64-YX-0619',color:"red",slot:1,time:new Date()},
    { carNo:'KA-62-AO-1533',color:"white",slot:2,time:new Date()},
    { carNo:'KA-50-MG-5373',color:"blue",slot:3,time:new Date()},
    { carNo:'KA-58-TW-9181',color:"blue",slot:4,time:new Date()},
    { carNo:'KA-62-VA-0202',color:"black",slot:5,time:new Date()},
  ];

  constructor() { }


  populateSlots(){
      this.freeSlots = [];
      this.parkingSlots = [];
      this.parkingAnalysis = [];

        for(let i=1;i<=this.totalSlots;i++){
          this.freeSlots.push(i);
        }
        for(let i=0;i<this.parkedCars;i++){
            let random = this.cars[Math.floor(Math.random() * 5)];
            random.slot = i+1;
            this.freeSlots.splice(0,1);
            // console.log(this.freeSlots);
            this.parkingSlots.push({...random});
      }
  }

  removeCar(index){
    let pos = this.parkingSlots.map(function(e) { return parseInt(e.slot); }).indexOf(parseInt(index));
    // console.log(pos);

    let removedCar = {
          ...this.parkingSlots[pos],
          outTime:new Date(),
          fee:20
        };

    let slot = parseInt(removedCar.slot)    
    this.parkingAnalysis.push(removedCar);    
    this.freeSlots.push(slot);
    // console.log(this.freeSlots);
    this.freeSlots.sort((a, b) => {
      if(a < b) return -1;
      else if(a > b) return 1;
      return 0;
  });
    // console.log(this.freeSlots);
    this.parkingSlots.splice(pos,1);
    this.parkedCars = this.parkingSlots.length;
    this.totalFees +=20;

    // console.log(this.parkingAnalysis);
  }

  parkCar(data){
    if(this.freeSlots.length>0){
      this.parkingSlots.push(data);
      let slot = parseInt(data.slot);
      

      let slotIndex = this.freeSlots.indexOf(slot)
      // console.log(slotIndex);
      this.freeSlots.splice(slotIndex,1);
      this.parkedCars = this.parkingSlots.length;
    }
  }

  setLoggedin( val: boolean){
    this.isLoggedin = val;
    this.stateChanged.emit(this.isLoggedin);
  }

  get isLoggedStatus(){
    return this.isLoggedin;
  }

}
