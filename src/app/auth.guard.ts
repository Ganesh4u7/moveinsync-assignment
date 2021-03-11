
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ParkingServiceService } from './parking-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private service: ParkingServiceService,
    private router: Router
    ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.service.isLoggedStatus){
       return true;
    }
    else{
      this.router.navigate(['']);
    }
    return false;
  }
}
