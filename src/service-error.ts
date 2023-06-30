import {omit} from 'lodash'
import {messageWithCauses, stackWithCauses} from 'pony-cause'

export interface IData {
  [key: string]: unknown
  causedBy?: Error
  httpCode?: number
}

export class ServiceError extends Error {
  public readonly $isServiceError = true
  public readonly code: string
  public readonly name: string = 'ServiceError'
  public readonly data?: unknown
  public httpCode?: number

  constructor(code: string, message: string, data?: IData) {
    super(message, {cause: data?.causedBy})
    this.message = messageWithCauses(this)

    this.code = code
    if (typeof data === 'object' && data) {
      if (typeof data.httpCode === 'number') {
        this.httpCode = data.httpCode
      }
      this.data = omit(data, 'causedBy', 'httpCode')
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
      stack: stackWithCauses(this),
      message: this.message,
      name: this.name,
      data: this.data,
      httpCode: this.httpCode,
      cause: this.cause,
    }
  }
}
