import { Validator } from './Validator.js'
import { z } from 'zod'

export class CGUCGVValidator extends  Validator{
  constructor() {
    super(z.object({
      approveCGV_CGU: z.boolean()
    }).refine((data)=> Boolean(data.approveCGV_CGU),{
      message:"Vous devez accepter les conditions générales de ventes et d'utilisations",
      path: ['approveCGV_CGU']
    }))
  }
}