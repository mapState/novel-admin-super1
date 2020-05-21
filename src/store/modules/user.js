import { login, logout, getInfo, getMenu } from '@/api/user'
import { getToken, setToken, removeToken, getId, setId, removeId,getType,setType,removeType } from '@/utils/auth'
import router, { resetRouter, asyncRoutes } from '@/router'

const state = {
  token: getToken(),
  id: getId(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menus: [],
  type:getType()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_TYPE: (state,type) => {
    state.type=type
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_ID', data.id)
        commit('SET_TYPE', data.type)
        setToken(data.token)
        setId(data.id)
        setType(data.type)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenu(state.id).then((res)=>{
        console.log(res)
        const menus=[...res.data]
        menus.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROLES', 'admin')
        commit('SET_NAME', 'admin')
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png')
        commit('SET_INTRODUCTION', '122')
        commit('SET_MENUS', menus)
        resolve({roles:['admin']})
      }).catch((error)=>{
          reject(error)
      })
      // try {
      //   const menus = [...asyncRoutes]
      //   commit('SET_ROLES', 'admin')
      //   commit('SET_NAME', 'admin')
      //   commit('SET_AVATAR', 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png')
      //   commit('SET_INTRODUCTION', '122')
      //   commit('SET_MENUS', menus)
      //   resolve({ roles: ['admin'] })
      // } catch (error) {
      //   reject(error)
      // }
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ID', '')
        commit('SET_ROLES', [])
        commit('SET_MENUS', [])
        commit('SET_TYPE', '')
        removeToken()
        removeType()
        removeId()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
