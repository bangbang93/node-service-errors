import {outputJSONSync} from 'fs-extra'
import {join} from 'path'
import {CommonError} from './apps/common'

export interface ErrorDefinition {
  [code: string]: readonly [message: string, httpCode?: number]
}
export interface IRawError {
  codePrefix: string
  errors: ErrorDefinition
}

const rawErrors: IRawError[] = [
  CommonError,
]

const ServiceErrors = rawErrors.reduce((p: ErrorDefinition, rawError) => {
  const codes: string[] = Object.keys(rawError.errors)
  for (const code of codes) {
    p[rawError.codePrefix + code] = rawError.errors[code]
  }
  return p
}, {})

outputJSONSync(join(__dirname, '/errors.json'), ServiceErrors, {spaces: 2})
