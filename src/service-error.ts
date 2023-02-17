import is from '@sindresorhus/is'
import {omit} from 'lodash'
import {VError} from 'verror'

export interface IData {
  [key: string]: unknown
  causedBy?: Error
  httpCode?: number
}

export class ServiceError extends VError {
  public readonly $isServiceError = true
  public readonly code: string
  public readonly name: string = 'ServiceError'
  public readonly data?: unknown
  public httpCode?: number

  constructor(code: string, data?: IData)
  constructor(code: string, message?: string, data?: IData)
  constructor(code: string, message?: string | IData, data?: IData) {
    if (typeof message !== 'string') {
      data = message
      message = undefined
    }
    super({
      name: ServiceError.name,
      cause: data?.causedBy,
      info: data && omit(data, 'causedBy'),
    }, '%s', typeof message === 'string' ? message : undefined)

    this.code = code
    if (data) {
      if (is.plainObject(data)) {
        if (is.number(data.httpCode)) {
          this.httpCode = data.httpCode
          delete data.httpCode
        }
      }
      this.data = data
    }
  }

  public static fromJSON(json: Record<string, unknown>): ServiceError {
    try {
      const error = new ServiceError(json.code as string, json.message as string,
        json.data as IData)
      error.httpCode = json.httpCode as number
      return error
    } catch (e) {
      if ('message' in json) {
        const err = new Error(json.message as string)
        err.stack = json.stack as string
        Object.assign(err, json)
        return new ServiceError('COMMON_UNKNOWN', '未知错误', {
          causedBy: err,
        })
      } else {
        return new ServiceError('COMMON_UNKNOWN', '未知错误', {
          error: json,
        })
      }
    }
  }

  public static fromError(error: Error): ServiceError {
    return new ServiceError('COMMON_UNKNOWN', '未知错误', {
      causedBy: error,
    })
  }

  public toJSON(): Record<string, unknown> {
    return {
      $isServiceError: this.$isServiceError,
      code: this.code,
      stack: VError.fullStack(this as any),
      message: this.message,
      name: this.name,
      data: VError.info(this as any),
      httpCode: this.httpCode,
      cause: VError.cause(this as any),
    }
  }
}
