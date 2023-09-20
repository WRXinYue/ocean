import service from '~/api/http'

const loginApi = {
  // 验证登录实例
  postVerification: (params: object) => service.post('/v1/auth/login', params),
}

export default loginApi
