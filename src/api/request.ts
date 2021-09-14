import axios from 'axios'
import config from './config'
import {Dialog, Toast} from 'vant'
import qs from 'qs'

const Axios = axios.create({ timeout: 1000 * 6});


// 请求拦截器，内部根据返回值，重新组装，统一管理。
Axios.interceptors.request.use(
    config => {
        // let userInfo = auth.getUserInfo();
        // let currentOrg = auth.getCurrentOrg();
        // config.headers['appid'] = userInfo ? userInfo.userCode : '';
        // config.headers['token'] = auth.getToken();
        // config.headers['currentloginnodecode'] = userInfo ? userInfo.nodeCode : '';
        // config.headers['currentLoginOrgCode'] = currentOrg ? currentOrg.orgCode : '';
        // config.headers['currentLoginOrgId'] = currentOrg ? currentOrg.orgId : '';
        // config.headers['timestamp'] = new Date().getTime();
        // if (config.data) {
        //
        // }
        return config;
    },
    error => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response 拦截器
Axios.interceptors.response.use(
    response => {
        const res = response.data;
        console.log(res);
        if (res.code === 1) {
            return res;
        } else {
            Dialog.alert({
                message: res.msg,
                theme: 'round-button',
            }).then(() => {
            });
            return Promise.reject(res.msg);
        }
    },
    error => {
        console.log('---ERR：' + error); // for debug
        Dialog.alert({
            message: '服务请求失败',
            theme: 'round-button',
        }).then(() => {
        });
        return Promise.reject(error);

    })

function get(url: string, params: unknown) {
    Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration:0
    });
    const baseURL = localStorage.getItem('baseURL')

    return new Promise((resolve, reject) => {
        Axios.get(baseURL + url, {
            params: params,
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        }).finally(()=>{
            Toast.clear()
        })
    })

}

function post(url: string, params: unknown) {
    Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration:0
    });
    const baseURL = localStorage.getItem('baseURL')
let headers={
    dataType:'JSON'
}
    return new Promise((resolve, reject) => {
        Axios.post(baseURL + url, qs.stringify(params)).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        }).finally(()=>{
            Toast.clear()
        })
    })

}

export default {
    get,
    post
}
