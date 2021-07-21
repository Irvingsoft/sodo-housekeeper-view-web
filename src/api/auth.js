import request from "@/router/axios";

export const getCaptcha = () => request({
  url: '/api/auth/authorize/captcha',
  method: 'get'
});

export const getPasswordPublicKey = () => request({
  url: '/api/auth/authorize/key',
  method: 'get'
});

export const authorize = (authType, username, password, captcha, code, encryptedData, iv, captchaKey, passwordKey) => request({
  url: '/api/auth/authorize',
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

export const access = (grantType, code) => request({
  url: '/api/auth/access',
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
