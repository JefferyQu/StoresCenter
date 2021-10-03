/*App公共数据仓库*/
export default {
    state: {
        //底部导航栏
        activeTab: 0,

        //当前操作单据
        bill: {},

        //已选组织
        selectedOrg: {
            orgId: '',
            orgName: '',
            orgType: '',
            business: []
        },

        //已选供应商
        selectedVendor:{
            orgId: '',
            orgName: '',
            orgType: '',
            business: []
        },

        //已选商品
        selectedGoods:[],

    },
    mutations: {

        /**
         * 功能描述：设置当前选中的底部导航栏
         * @param {object} state
         * @param {number} params 导航栏下标
         */
        SET_ACTIVE_TAB(state:any,params:number){
            state.activeTab=params
        },

        /**
         * 功能描述：设置当前单据信息
         * @param {object} state
         * @param {object} params 单据信息
         */
        SET_BILL(state:any,params:any){
            state.bill=params
        },

        /**
         * 功能描述：设置已选组织信息
         * @param {object} state
         * @param {object} params 单据信息
         */
        SET_ORGANIZATION(state: any, params: any) {
            state.selectedOrg = params
            localStorage.setItem('selectedOrg', JSON.stringify(state.selectedOrg))
        },


        /**
         * 功能描述：设置已选供应商信息
         * @param {object} state
         * @param {object} params 单据信息
         */
        SET_VENDOR(state: any, params: any) {
            state.selectedVendor = params
        },

        /**
         * 功能描述：设置已选商品信息
         * @param {object} state
         * @param {array} params 商品列表
         */
        SET_SELECTED_GOODS(state:any,params:Array<Object>){
            state.selectedGoods=params
        }
    },
    actions: {},
}
