import {getStore, setStore} from "@/util/store";
import {Message} from "element-ui";
import {removeToken, setToken} from "@/util/auth";
import {deepClone, getEncryptor} from "@/util/util";
import {validatenull} from "@/util/validate";
import {access, authorize, insertSignatureKey, logout} from "@/api/auth";
import {JSEncrypt} from 'jsencrypt'

const auth = {
  state: {
    userInfo: getStore({name: 'userInfo'}) || {},
    permission: getStore({name: 'permission'}) || [],
    signatureInfo: getStore({name: 'signatureInfo'}) || {},
    roles: [],
    menu: getStore({name: 'menu'}) || [],
    menuAll: [],
    token: getStore({name: 'token'}) || '',
  },
  actions: {
    //根据用户名登录
    AuthorizeByUsername({commit}, authInfo) {
      return new Promise(async (resolve, reject) => {
        await authorize(
          authInfo.authType, authInfo.username, getEncryptor(authInfo.publicKey.content).encrypt(authInfo.password), authInfo.captcha,
          null, null, null,
          authInfo.captchaImage.id, authInfo.publicKey.id).then(res => {
          authInfo.authCode = res.data.data;
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
    AccessByAuthCode({commit, dispatch}, authInfo) {
      return new Promise(async (resolve, reject) => {
        await access(authInfo.grantType, authInfo.authCode).then(res => {
          if (res.data.code === 200) {
            commit('SET_TOKEN', res.data.data)
            dispatch('GetUserInfo')
          }
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
    InsertSignatureKey({commit}, signatureInfo) {
      let encryptor = new JSEncrypt({'log': true});
      encryptor.setPublicKey(signatureInfo.content);
      insertSignatureKey(signatureInfo.id, encryptor.encrypt(signatureInfo.signatureKey)).then(res => {
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
          commit('SET_ROLES', []);
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
        commit('SET_MENU', []);
        commit('SET_MENU_ALL', []);
        commit('SET_ROLES', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      console.log("aaa" + token)
      setToken(token)
      state.token = token;
      setStore({name: 'token', content: state.token, type: 'session'})
    },
    SET_SIGNATURE_INFO: (state, signatureInfo) => {
      state.signatureInfo = signatureInfo;
      setStore({name: 'signatureInfo', content: state.signatureInfo})
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({name: 'menu', content: state.menu, type: 'session'})
      if (validatenull(menu)) return;
      //合并动态路由去重
      let menuAll = state.menuAll;
      menuAll = menuAll.concat(menu).reverse();
      let newMenu = [];
      for (let item1 of menuAll) {
        let flag = true;
        for (let item2 of newMenu) {
          if (item1.name === item2.name || item1.path === item2.path) {
            flag = false;
          }
        }
        if (flag) newMenu.push(item1);
      }
      state.menuAll = newMenu;
      setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      let result = [];

      function getCode(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const chiildren = ele.children;
            const code = ele.code;
            if (chiildren) {
              getCode(chiildren)
            } else {
              result.push(code);
            }
          }

        })
      }

      getCode(permission);
      state.permission = {};
      result.forEach(ele => {
        state.permission[ele] = true;
      });
      setStore({name: 'permission', content: state.permission, type: 'session'})
    }
  }

}
export default auth
