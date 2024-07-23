import { Validator } from './Validator.js'
import { ValidationException } from '../Exceptions/ValidationException.js'
import { z } from 'zod'

export class CaptchaValidator extends Validator {
  constructor() {
    super(
      z.object({
        captcha: z.string({message:"Veillez a bien remplir le captcha"})
      }),
    )
  }

  async afterValidation(payload) {
    const captcha = payload.captcha
    const secret = process.env.HCAPTCHA_SECRET
    const body = new URLSearchParams({
      secret: secret,
      response: captcha
    });

    try{
      const response = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      })
      const data = await response.json()

      if (!data.success) {
        console.warn(data)
        throw new ValidationException([
          {
            path: 'captcha',
            message: 'Le captcha est invalide'
          }
        ])
      }
    }catch(e){
      console.error(e)
      throw new ValidationException([
        {
          path: 'captcha',
          message: 'Le captcha est invalide'
        }
      ])
    }
  }
}