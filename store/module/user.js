import { login, getUserInfo } from '@/api/user'
import { setToken, getToken, setAccess, getAccess, getPermissionNames, setPermissionNames, getUserName, setUserName,
  getUserId, setUserId, setAvator, getAvator, clearCookies } from '@/libs/util'

export default {
  state: {
    username: getUserName(),
    userId: getUserId(),
    avatorImgPath: getAvator(),
    token: getToken(),
    access: getAccess(),
    permissionNames: getPermissionNames(),
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath;
      setAvator(avatorPath);
    },
    setUserId (state, id) {
      state.userId = id;
      setUserId(id);
    },
    setUsername (state, name) {
      state.username = name;
      setUserName(name);
    },
    setAccess (state, access) {
      state.access = access;
      setAccess(access)
    },
    setToken (state, token) {
      state.token = token;
      setToken(token)
    },
    setPermissionNames (state, permissionNames) {
      state.permissionNames = permissionNames;
      setPermissionNames(permissionNames)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password }) {
      username = username.trim();
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          commit('setToken', res.data);
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        clearCookies();
        commit('setAvator', '');
        commit('setUserId', '');
        commit('setUsername', '');
        commit('setToken', '');
        commit('setAccess', []);
        commit('setPermissionNames', []);
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res.data;
          commit('setAvator', data.imageUrl);
          commit('setUsername', data.name);
          commit('setUserId', data.user_id);
          commit('setAccess', data.roles.map(role => role.code) || []);
          commit('setPermissionNames', data.permissionList.map(permission => permission.name) || []);
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
