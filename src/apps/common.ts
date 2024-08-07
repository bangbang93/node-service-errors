export const CommonError = {
  COMMON_UNKNOWN: ['未知错误', 500],
  COMMON_NEED_LOGIN: ['需要登录', 401],
  COMMON_PERMISSION_DENIED: ['访问拒绝', 403],
  COMMON_NO_SUCH_OBJECT: ['找不到对象', 404],
  COMMON_THIRD_PARTY_ERROR: ['第三方服务调用错误', 505],
  COMMON_INVALID_PARAMETER: ['缺少参数', 400],
  COMMON_ALREADY_EXISTS: ['已经存在', 409],
  COMMON_WRONG_STATUS: ['状态错误', 406],
  COMMON_CAPTCHA_ERROR: ['验证失败', 403],
} as const
