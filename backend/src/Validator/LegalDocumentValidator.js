import { Validator } from './Validator.js'
import { z } from 'zod'

export class LegalDocumentValidator extends Validator {
    constructor() {
        super(LegalDocumentValidator.schema())
    }

    static schema() {
        return z.object({
            name: z
                .string()
                .min(2, 'Le nom du document doit être de minimum 2 caractères')
                .max(
                    30,
                    'Le nom du document ne doit pas dépasser 30 caractères',
                ),
            content: z
                .string()
                .min(
                    2,
                    'Le contenu du document est requis (minimum 2 caractères)',
                ),
            published: z.boolean(),
        })
    }
}
