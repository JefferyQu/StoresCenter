
/*业务类型*/
export enum BUSINESS_TYPE{
    '门店要货'='101',
    '要货处理'='102',
    '配送发货'='103',
    '配送验收'='104',
    '新品上架'='107'
}

/*页面进入类型*/
export enum ENTER_TYPE{
    NEW='0',
    QUERY='1',
    ORG_CHOOSE='2',
    VENDOR_CHOOSE='3',
    GOODS_CHOOSE='4',

}

/*单据类型*/
export enum BILL_TYPE {
    PURCHASE = '1012',
    DELIVERY = '1034',

}

/*单据状态*/
export enum BILL_STATUS {
    COMMITTED = '0',        // 已提交
    PASSED = '1',     // 审核通过
    FAILED = '2', // 审核退回
    UNDONE = '3',  // 已撤销
    WAIT_ACCEPT = '4',     // 未验收
    PART_ACCEPT = '5',// 异常验收
    FULL_ACCEPT = '6', // 正常验收
    APPLY = '7'            // 申请状态
}

/*状态可读化-门店*/
export enum STATUS_READABLE{
    '已提交',
    '审核通过',
    '审核退回',
    '已撤销',
    '待验收',
    '部分验收',
    '完整验收',
    '申请状态'
}

/*状态可读化--供应商*/
export enum STATUS_READABLE_VENDOR{
    '未处理',
    '已通过',
    '已驳回',
    '已撤销',
    '已出库',
    '部分验收',
    '完整验收',
    '申请状态'
}

export function getEnums(enumType:any,value:any) {
    for (var e of enumType) {
        if (e == value) {
            return e;
        }
    }
}
