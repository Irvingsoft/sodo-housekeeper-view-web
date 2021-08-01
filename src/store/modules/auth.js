import {getStore, setStore} from "@/util/store";
import {Message} from "element-ui";
import {removeToken, setToken} from "@/util/auth";
import {deepClone, getEncryptor} from "@/util/util";
import {validatenull} from "@/util/validate";
import {access, authorize, insertSignatureKey, logout} from "@/api/auth";
import {JSEncrypt} from 'jsencrypt'

const auth = {
  state: {
    token: getStore({name: 'token'}) || '',
    signatureInfo: getStore({name: 'signatureInfo'}) || {},
  },
  actions: {
    //根据用户名登录
    AuthorizeByUsername({commit}, authInfo) {
      return new Promise(async (resolve, reject) => {
        await authorize(
          authInfo.authType,
          authInfo.username,
          getEncryptor(authInfo.publicKey.content).encrypt(authInfo.password), authInfo.captcha,
          null,
          null,
          null,
          authInfo.captchaImage.id,
          authInfo.publicKey.id).then(res => {
            authInfo.authCode = "";
            if (res.data.code === 200) {
              authInfo.authCode = res.data.data;
            }
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
    AccessByAuthCode({commit, dispatch}, authInfo) {
      return new Promise(async (resolve, reject) => {
        await access(authInfo.grantType, authInfo.authCode).then(async res => {
          if (res.data.code === 200) {
            await commit('SET_TOKEN', res.data.data)
            dispatch('GetUser')
          }
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
    InsertSignatureKey({commit}, signatureInfo) {
      insertSignatureKey(signatureInfo.id, getEncryptor(signatureInfo.content).encrypt(signatureInfo.signatureKey)).then(res => {
        if (res.data.code === 200) {
          commit('SET_SIGNATURE_INFO', signatureInfo);
        }
      })
    },
    // 登出
    LogOut({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_MENU', [])
          commit('SET_MENU_ALL', []);
          commit('SET_USER_INFO', []);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销session
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENU', [])
        commit('SET_MENU_ALL', []);
        commit('SET_USER_INFO', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token;
      setStore({name: 'token', content: state.token, type: 'session'})
    },
    SET_SIGNATURE_INFO: (state, signatureInfo) => {
      state.signatureInfo = signatureInfo;
      setStore({name: 'signatureInfo', content: state.signatureInfo})
    },
  }

}
export default auth
