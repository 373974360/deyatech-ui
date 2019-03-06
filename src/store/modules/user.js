import {removeToken, setToken} from '@/util/auth'
import {getStore, setStore} from '@/util/store'
import {isURL} from '@/util/validate'
import {deepClone} from '@/util/util'
import webiste from '@/config/website'
import {loginByUsername, logout, refeshToken} from '@/api/common'
import {getMenuTree} from '@/api/admin/menu'


function addPath(ele, first) {
  const propsConfig = webiste.menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
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
    menu: getStore({name: 'menu'}) || [],
    token: getStore({name: 'token'}) || ''
  },
  actions: {
    //根据用户名登录
    LoginByUsername({commit, dispatch}, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(res => {
          const data = res.data;
          commit('SET_TOKEN', data.token);
          commit('SET_USERIFNO', data);
          dispatch('SetEnums');
          dispatch('SetDicts');
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        }).catch(err => {
          reject(err);
        })
      })
    },
    //获取系统菜单
    GetMenu({commit, dispatch}) {
      return new Promise(resolve => {
        getMenuTree({type: 1}).then((res) => {
          const data = res.data
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          })
          commit('SET_MENU', menu)
          dispatch('GetButtons');
          resolve(menu)
        })
      })
    },
    //获取系统按钮
    GetButtons({commit}) {
      return new Promise((resolve) => {
        getMenuTree().then(res => {
          commit('SET_PERMISSION', res.data);
          resolve();
        })
      })
    },
    // 登出
    LogOut({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_MENU', [])
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
        commit('SET_TOKEN', '')
        commit('SET_MENU', [])
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token;
      setStore({name: 'token', content: state.token, type: 'session'})
    },
    SET_USERIFNO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({name: 'userInfo', content: state.userInfo})
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({name: 'menu', content: state.menu, type: 'session'})
    },
    SET_PERMISSION: (state, menus) => {
      let result = [];

      function getPermission(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const children = ele.children;
            const permission = ele.permission;
            if (children && children.length > 0) {
              getPermission(children)
            }
            result.push(permission);
          }
        })
      }

      getPermission(menus);
      state.permission = {};
      result.forEach(ele => {
        state.permission[ele] = true;
      });
      setStore({name: 'permission', content: state.permission, type: 'session'})
    }
  }

}
export default user
