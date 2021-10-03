import http from "../api/request";
import {Toast} from "vant";
import {USER} from '../common/classes'
/*用户数据仓库*/
export default {
    state: {
        token: '',

        //是否登陆
        isLogin: false,

        //用户信息
        userInfo: {
            username: '',
            orgId: '',
            orgName: '',
            panelModule: []
        },

    },
    mutations: {
        /**
         * 功能描述：设置用户信息
         * @param {object} state 仓库数据
         * @param {object} params 用户信息
         */
        SET_USERINFO(state: any, params: USER) {
            let userInfo = state.userInfo
            userInfo.username = params.username || userInfo.username
            userInfo.orgId = params.orgId || userInfo.orgId
            userInfo.orgName = params.orgName || userInfo.orgName
            userInfo.panelModule = params.panelModule || userInfo.panelModule

            state.isLogin = !!userInfo.username
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        },


    },
    actions: {

        /**
         * 功能描述：登录
         * @param {function} commit
         * @param {object} userInfo 用户信息
         */
        Login({commit}: any, userInfo: any) {
            return new Promise((resolve, reject) => {
                http.post('/users/login', userInfo).then((res: any) => {
                    commit('SET_USERINFO', res)
                    Toast(res.msg)
                    // router.push('/Home')
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })

        },


        /**
         * 功能描述：退出登录
         * @param {function} commit
         */
        loginOut({commit}: any) {
            commit('SET_USERINFO', {})
        },

        /**
         * 功能描述：保存用户信息
         * @param {object} state 仓库信息
         * @param {function} commit
         */
        saveUserInfo({state, commit}: any) {
            let userInfo = JSON.parse(JSON.stringify(state.userInfo))
            userInfo.panelModule = JSON.stringify(userInfo.panelModule)
            http.post('/users/save', userInfo).then((res: any) => {

            })
        },

        /**
         * 功能描述：获取用户信息
         * @param {function} commit
         * @param {object} userInfo 用户信息
         */
        getUserInfo({commit}: any, userInfo: any) {
            http.get('/users/getInfo', {username: userInfo.username}).then((res: any) => {
                console.log(res);
            })
        }


    },
}
