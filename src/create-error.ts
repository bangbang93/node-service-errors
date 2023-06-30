import {CommonError} from './apps/common'
import {IData, ServiceError} from './service-error'

interface ErrorDefinition {
  [code: string]: readonly [message: string, httpCode?: number]
}

const ServiceErrors: ErrorDefinition = {
  ...CommonError,
}

export {
  ServiceErrors,
}

type ErrorCode = keyof typeof CommonError
type ProxyFunction = (message?: string, data?: Record<string, unknown>) => ServiceError

export function registerErrors(errors: ErrorDefinition): void {
  Object.assign(ServiceErrors, errors)
}

function _createError(code: string, message?: string, data?: IData, stackAt?: ProxyFunction): ServiceError {
  const error = ServiceErrors[code] ?? ServiceErrors.COMMON_UNKNOWN
  const serviceError = new ServiceError(code, message ?? error[0], data)
  serviceError.httpCode ??= error[1] as number
  Error.captureStackTrace(serviceError, stackAt ?? _createError)
  return serviceError
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type createError = {
  [code in ErrorCode]: (message?: string, data?: IData) => ServiceError
}

export const createError: createError & typeof _createError = new Proxy(_createError, {
  get(target: typeof _createError, p: string): (message?: string, data?: IData) => ServiceError {
    let fn: ProxyFunction
    if (p in ServiceErrors) {
      fn = (message, data) => target(p, message, data, fn)
    } else {
      fn = (message, data) => target('COMMON_UNKNOWN', `${p.toString()}: ${message ?? ''}`, data, fn)
    }
    return fn
  },
}) as unknown as createError & typeof _createError
