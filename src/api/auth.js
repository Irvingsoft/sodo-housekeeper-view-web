import request from "@/router/axios";

export const getCaptcha = () => request({
  url: '/api/auth/authenticate/captcha',
  method: 'get'
});

export const getPasswordPublicKey = () => request({
  url: '/api/auth/authenticate/key',
  method: 'get'
});

export const authenticate = (authType, username, password, captcha, code, encryptedData, iv, captchaKey, passwordKey) => request({
  url: '/api/auth/authenticate',
  method: 'post',
  headers: {
    Captcha_Key: captchaKey,
    Password_Key: passwordKey
  },
  data: {
    authType,
    username,
    password,
    captcha,
    code,
    encryptedData,
    iv,
  }
});

export const authorize = (grantType, code) => request({
  url: '/api/auth/authorize',
  method: 'post',
  data: {
    grantType,
    code
  }
});

export const getSignaturePublicKey = () => request({
  url: '/api/auth/signature/key',
  method: 'get'
});

export const insertSignatureKey = (publicKey, data) => request({
  url: '/api/auth/signature/key',
  method: 'post',
  headers: {
    Rsa_Private_Key: publicKey
  },
  data: {
    content: data
  }
})

export const validateSignaturePublicKey = () => request({
  url: '/api/auth/signature/key/validate',
  method: 'get'
});

export const logout = () => request({
  url: '/api/auth/authenticate/logout',
  method: 'get'
})
