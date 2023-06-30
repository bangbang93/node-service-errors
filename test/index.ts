import {ServiceError} from '../src'

const err = new Error('boom')
// @ts-ignore
err['a'] = 'b'
const serviceError = ServiceError.fromError(err)
// console.log(serviceError.toJSON())
console.log(serviceError)
console.log(serviceError.toJSON())
