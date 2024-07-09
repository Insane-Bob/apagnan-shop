import { Controller } from '../../Core/Controller.js'
import { UserWidgetPolicy } from '../Policies/UserWidgetPolicy.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { UserWidgetValidator } from '../../Validator/UserWidgetValidator.js'

export class UserWidgetController extends Controller{
  user_resource; // @provided UserProvider
  widget; // @provided UserWidgetProvider
  async showUserWidget(){
    this.can(UserWidgetPolicy.show,this.user_resource)
    this.widget = await Database.getInstance().models.UserWidget.findOne({
      where:{
        userId:this.user_resource.id
      }
    })
    NotFoundException.abortIf(!this.widget)
    this.res.json(this.widget)
  }

  async put(){
    this.can(UserWidgetPolicy.show,this.user_resource)
    const payload = this.validate(UserWidgetValidator)
    await Database.getInstance().models.UserWidget.update(payload,{
      where:{
        userId:this.user_resource.id
      }
    })
    this.res.sendStatus(200)
  }
}