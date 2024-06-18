import brevo from "@getbrevo/brevo"
const defaultClient = Brevo.ApiClient.instance
const apiKey = defaultClient.authentications['api_key']
apiKey.apiKey = import.meta.env.BREVO_API_KEY

export class Email{
    subject = null
    to = []
    templateId = null
    params = {}
  
    constructor(){}

    addTo(email, name){
        this.to.push({email, name})
        return this
    }
    setSubject(subject){
        this.subject = subject
        return this
    }
    setTemplate(templateId){
        this.templateId = templateId
        return this
    }
    setParams(params){
        this.params = params
        return this
    }

    get json(){
        return {
            to: this.to,
            subject: this.subject,
            templateId: this.templateId,
            params: this.params
        }
    
    }
}

export class EmailSender { 
    static apiInstance = new brevo.TransactionalEmailsApi()
    static sendSmtpEmail = new brevo.SendSmtpEmail()

    static async send(email){
        if(!(email instanceof Email))
            throw new Error("Email instance expected")
        
        try {
            const data = await EmailSender.apiInstance.sendTransacEmail(email.json)
            return data 
        } catch (error) {
            console.error(error)
            throw new Error("Failed to send email")
        }

    }
}
