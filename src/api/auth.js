import request from "@/router/axios";
import {baseUrl} from "@/config/env";

export const getCaptcha = () => request({
  url: baseUrl + '/auth/authorize/captcha',
  method: 'get'
});

export const getPasswordPublicKey = () => request({
  url: baseUrl + '/auth/authorize/key',
  method: 'get'
});

export const authorize = (authType, username, password, captcha, code, encryptedData, iv, captchaKey, passwordKey) => request({
  url: baseUrl + '/auth/authorize',
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
  url: baseUrl + '/auth/access',
  method: 'post',
  data: {
    grantType,
    code
  }
});

export const getSignaturePublicKey = () => request({
  url: baseUrl + '/auth/signature/key',
  method: 'get'
});

export const insertSignatureKey = (publicKey, data) => request({
  url: baseUrl + '/auth/signature/key',
  method: 'post',
  headers: {
    Rsa_Private_Key: publicKey
  },
  data: {
    content: data
  }
})

export const validateSignaturePublicKey = () => request({
  url: baseUrl + '/auth/signature/key/validate',
  method: 'get'
});
