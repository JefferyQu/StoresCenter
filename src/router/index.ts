import {RouteRecordRaw, createRouter, createWebHistory} from "vue-router";
import Main from '../views/home/Main.vue'
import ServiceAddress from '../views/ServiceAddress.vue'
import Login from "../views/Login.vue";
import {useStore} from 'vuex'
import {Dialog} from "vant";


const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "/",
        redirect: "/ServiceAddress",
    },
    {
        path: "/ServiceAddress",
        name: "ServiceAddress",
        component: ServiceAddress,
        meta: {
            level: 0, //页面层级，控制前进后退动画
            keepAlive: false
        }
    },
    {
        path: "/Login",
        name: "Login",
        component: Login,
        meta: {
            level: 1,
            keepAlive: false
        }
    }
    ,
    {
        path: "/Main",
        name: "Main",
        redirect: '/Main/Home',
        component: Main,
        children: [
            {
                path: "Home",
                name: "Home",
                component: () => import('../views/home/Home.vue'),
                meta: {
                    level: 2,
                    keepAlive: false
                }
            },
            {
                path: "Business",
                name: "Business",
                component: () => import('../views/business/Business.vue'),
                meta: {
                    level: 3,
                    keepAlive: false
                }
            },
            {
                path: "Personal",
                name: "Personal",
                component: () => import('../views/personal/Personal.vue'),
                meta: {
                    level: 4,
                    keepAlive: false
                }
            }
        ]
    },
    {
        path: "/bill-list/:code/:name",
        name: "bill-list",
        component: () => import("../views/business/BillList.vue"),
        meta: {
            level: 4,
            keepAlive: false
        }
    },
    {
        path: "/purchase",
        name: "purchase",
        component: () => import("../views/business/Purchase.vue"),
        meta: {
            level: 5,
            keepAlive: true
        }
    },
    {
        path: "/panel-module",
        name: "panel-module",
        component: () => import("../views/home/PanelModuleChoose.vue"),
        meta: {
            level: 3, //页面层级，控制前进后退动画
            keepAlive: false
        }
    },
    {
        path: "/add-goods",
        name: "add-goods",
        component: () => import("../views/business/AddGoods.vue"),
        meta: {
            level: 5,
            keepAlive: true
        }
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

//路由守卫
router.beforeEach((to, from, next) => {
    // console.log(to);
    // console.log(from);

    const localUserInfo = JSON.parse(<string>localStorage.getItem('userInfo'))
    // console.log('本地的用户信息：',localUserInfo)

    if (!localUserInfo && to.path != '/Login' &&to.path != '/ServiceAddress') {
        Dialog.alert({
            message: '请先登录',
            theme: 'round-button',
        }).then(() => {
            next('/Login')
        });
    } else {
        next()
    }

})
export default router;
