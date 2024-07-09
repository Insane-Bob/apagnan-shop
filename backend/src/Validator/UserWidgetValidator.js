import { Validator } from './Validator.js'
import { z } from 'zod'

export class UserWidgetValidator extends Validator{
  constructor() {
    super(UserWidgetValidator.put())
  }

  static put(){
    let jsonSchema = z.object({
      name: z.string(),
      styles: z.object({
        grid: z.string().optional(),
      })
    })

    return z.object({
      json: z.array(jsonSchema)
    })
  }
}