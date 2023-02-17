import {ServiceError} from '../src'

const err = new Error()
// @ts-ignore
err['a'] = 'b'
const serviceError = ServiceError.fromError(err)
// console.log(serviceError.toJSON())
console.log(serviceError.cause())
console.log(serviceError.toJSON())
