import {setStore, getStore} from '@/util/store'
import {isURL, validatenull} from '@/util/validate'
import {deepClone} from '@/util/util'
import website from '@/config/website'
import {
  getUserInfo,
  top, route, button
} from '@/api/user'


function addPath(ele, first) {
  const menu = website.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    })
  }

}

const user = {
  state: {
    userInfo: getStore({name: 'userInfo'}) || [],
    permission: getStore({name: 'permission'}) || {},
    roles: [],
    menu: getStore({name: 'menu'}) || [],
    menuAll: [],
    token: getStore({name: 'token'}) || '',
  },
  actions: {
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
    GetTopMenu() {
      return new Promise(resolve => {
        top().then((res) => {
          const data = res.data.data || []
          resolve(data)
        })
      })
    },
    //获取系统菜单
    GetRoute({commit, dispatch}, parentId) {
      return new Promise(resolve => {
        route(parentId).then((res) => {
          const data = res.data.data
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          })
          commit('SET_MENU', menu);
          commit('SET_MENU_ALL', menu);
          dispatch('GetButton');
          resolve(menu)
        })
      })
    },
    GetButton({commit}) {
      return new Promise((resolve) => {
        button().then(res => {
          const data = res.data.data;
          commit('SET_PERMISSION', data);
          resolve();
        })
      })
    },
  },
  mutations: {
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({name: 'userInfo', content: state.userInfo})
    },
  }

}
export default user
