/*App公共数据仓库*/
export default {
    state: {
        activeTab: 0,
        bill: {},
        selectedOrg: {
            orgId: '',
            orgName: '',
            orgType: '',
            business: []
        },
        selectedVendor:{
            orgId: '',
            orgName: '',
            orgType: '',
            business: []
        },
        selectedGoods:[],

    },
    mutations: {
        /*设置单据信息*/
        SET_BILL(state:any,params:any){
            state.bill=params
        },

        /*设置组织信息*/
        SET_ORGANIZATION(state: any, params: any) {
            state.selectedOrg = params
            localStorage.setItem('selectedOrg', JSON.stringify(state.selectedOrg))
        },

        /*设置供应商信息*/
        SET_VENDOR(state: any, params: any) {
            state.selectedVendor = params
        },

        /*设置已选的商品*/
        SET_SELECTED_GOODS(state:any,params:Array<Object>){
            state.selectedGoods=params
        }
    },
    actions: {},
}
