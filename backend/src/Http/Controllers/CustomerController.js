import { Controller } from '../../Core/Controller.js'
import {UnauthorizedException, UnprocessableEntity} from "../../Exceptions/HTTPException.js";
import {UserServices} from "../../Services/UserServices.js";
import {TokenServices} from "../../Services/TokenServices.js";

export class CustomerController extends Controller {

  store(){
    this.res.json({
        message: 'Store'
    })
  }


  show(){

    this.res.json({
        message: 'Show'
    })
  }
}
