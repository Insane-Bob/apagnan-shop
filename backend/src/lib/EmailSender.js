import axios from 'axios'

const url = 'https://api.brevo.com/v3/smtp/email'

export class Email {
    subject = null
    to = []
    templateId = null
    params = {}

    addTo(email, name) {
        this.to.push({ email, name })
        return this
    }
    setSubject(subject) {
        this.subject = subject
        return this
    }
    setTemplate(templateId) {
        this.templateId = templateId
        return this
    }
    setParams(params) {
        this.params = params
        return this
    }

    get json() {
        return {
            header: this.header,
            to: this.to,
            subject: this.subject,
            templateId: this.templateId,
            params: this.params,
        }
    }
}

export class EmailSender {
    static apiInstance = axios.create({
        baseURL: url,
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
        },
    })

    static async send(email) {
        if (!(email instanceof Email))
            throw new Error('Email instance expected')

        try {
            const data = await EmailSender.apiInstance.post(
                url,    
                email.json,
            )
            return data
        } catch (error) {
            console.error(error)
            throw new Error('Failed to send email')
        }
    }
}
