import http from "../api/request";
import {Toast} from "vant";

/*用户数据仓库*/
export default {
    state: {
        token: '',
        isLogin: false,
        userInfo: {
            username: '',
            orgId: '',
            orgName: '',
            panelModule: []
        },

    },
    mutations: {
        /*设置用户信息*/
        SET_USERINFO(state: any, params: any) {
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

        /*登录*/
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

        /*退出登录*/
        loginOut({commit}: any) {
            commit('SET_USERINFO', {})
        },

        /*保存用户信息*/
        saveUserInfo({state, commit}: any) {
            let userInfo = JSON.parse(JSON.stringify(state.userInfo))
            userInfo.panelModule = JSON.stringify(userInfo.panelModule)
            http.post('/users/save', userInfo).then((res: any) => {

            })
        },

        /*获取用户信息*/
        getUserInfo({commit}: any, userInfo: any) {
            http.get('/users/getInfo', {username: userInfo.username}).then((res: any) => {
                console.log(res);
            })
        }


    },
}
