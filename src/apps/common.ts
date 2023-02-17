import {IRawError} from '../create-error'

export const CommonError: IRawError = {
  codePrefix: 'COMMON_',
  errors: {
    UNKNOWN: ['未知错误', 500],
    NEED_LOGIN: ['需要登录', 401],
    PERMISSION_DENIED: ['访问拒绝', 403],
    NO_SUCH_OBJECT: ['找不到对象', 404],
    THIRD_PARTY_ERROR: ['第三方服务调用错误', 505],
    INVALID_PARAMETER: ['缺少参数', 400],
    ALREADY_EXISTS: ['已经存在', 409],
    WRONG_STATUS: ['状态错误', 406],
  },
}
