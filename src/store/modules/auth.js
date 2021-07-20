import {getStore, setStore} from "@/util/store";
import {
  getButtons,
  getMenu,
  getTopMenu,
  getUserInfo,
  loginBySocial,
  loginByUsername,
  logout,
  refreshToken
} from "@/api/user";
import {Message} from "element-ui";
import {removeToken, setToken} from "@/util/auth";
import {deepClone} from "@/util/util";
import {validatenull} from "@/util/validate";
import {access, authorize, insertSignatureKey} from "@/api/auth";
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
      return new Promise((resolve, reject) => {
        let encryptor = new JSEncrypt({'log': true});
        encryptor.setPublicKey(authInfo.publicKey.content);
        authorize(authInfo.authType, authInfo.username, encryptor.encrypt(authInfo.password), authInfo.captcha,
          null, null, null,
          authInfo.captchaImage.id, authInfo.publicKey.id).then(res => {
          resolve();
        }).catch(error => {
          reject(error);
        })
        // TODO
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
    //根据第三方信息登录
    LoginBySocial({commit}, userInfo) {
      return new Promise((resolve) => {
        loginBySocial(userInfo.tenantId, userInfo.source, userInfo.code, userInfo.state).then(res => {
          const data = res.data;
          if (data.success) {
            commit('SET_TOKEN', data.data.accessToken);
            commit('SET_REFRESH_TOKEN', data.data.refreshToken);
            commit('SET_USER_INFO', data.data);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
          } else {
            Message({
              message: data.msg,
              type: 'error'
            })
          }
          resolve();
        })
      })
    },
    //根据手机号登录
    LoginByPhone({commit}, userInfo) {
      return new Promise((resolve) => {
        loginByUsername(userInfo.phone, userInfo.code).then(res => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        })
      })
    },
    GetUserInfo({commit}) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data.data;
          commit('SET_ROLES', data.roles);
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      })
    },
    Access({commit}, authCode) {
      return new Promise((resolve, reject) => {
        access(authCode).then((res) => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          resolve();
        })
      })
    },
    //刷新token
    RefreshToken({state, commit}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refreshToken).then(res => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          resolve(data);
        }).catch(error => {
          reject(error)
        })
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
    GetTopMenu() {
      return new Promise(resolve => {
        getTopMenu().then((res) => {
          const data = res.data.data || []
          resolve(data)
        })
      })
    },
    //获取系统菜单
    GetMenu({commit, dispatch}, parentId) {
      return new Promise(resolve => {
        getMenu(parentId).then((res) => {
          const data = res.data.data
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          })
          commit('SET_MENU', menu);
          commit('SET_MENU_ALL', menu);
          dispatch('GetButtons');
          resolve(menu)
        })
      })
    },
    GetButtons({commit}) {
      return new Promise((resolve) => {
        getButtons().then(res => {
          const data = res.data.data;
          commit('SET_PERMISSION', data);
          resolve();
        })
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token;
      setStore({name: 'token', content: state.token, type: 'session'})
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({name: 'userInfo', content: state.userInfo})
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
