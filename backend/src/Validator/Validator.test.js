import { Validator } from './Validator.js'
import { UserFactory } from '../database/factories/UserFactory.js'
import z from 'zod'
describe('Test validaor', () => {
    let schema = z.object({
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        number: z.number().optional(),
        array: z
            .array(
                z.object({
                    name: z.string().optional(),
                    array: z.array(z.string()).optional(),
                    arrayNumber: z.array(z.number()).optional(),
                }),
            )
            .optional(),
        object: z
            .object({
                name: z.string().optional(),
                array: z.array(z.string()).optional(),
                arrayNumber: z.array(z.number()).optional(),
            })
            .optional(),
    })

    let validator = new Validator(schema)

    it('should return email', () => {
        let data = {
            email: UserFactory.instanciate().email,
        }

        let result = validator.validate(data)
        expect(result).toEqual(data)
    })

    it('should return password', () => {
        let data = {
            password: 'password',
        }

        let result = validator.validate(data)
        expect(result).toEqual(data)

        let data2 = {
            password: '<script> alert("hello") </script>',
        }

        let result2 = validator.validate(data2)
        expect(result2).not.toBe(data2)
    })

    it('should return array', () => {
        let data = {
            array: [
                {
                    name: 'name',
                    array: ['name'],
                    arrayNumber: [1],
                },
            ],
        }

        let result = validator.validate(data)
        expect(result).toEqual(data)
    })

    it('should return object', () => {
        let data = {
            object: {
                name: 'name',
                array: ['name'],
                arrayNumber: [1],
            },
        }

        let result = validator.validate(data)
        expect(result).toEqual(data)

        let data2 = {
            object: {
                name: '<script> alert("hello") </script>',
                array: ['name'],
                arrayNumber: [1],
            },
        }

        let result2 = validator.validate(data2)
        expect(result2.object.name).not.toBe(data2.object.name)
        expect(result2.object.array).toStrictEqual(data2.object.array)
    })

    it('should return number', () => {
        let data = {
            number: 1,
        }

        let result = validator.validate(data)
        expect(result).toEqual(data)
    })
})
