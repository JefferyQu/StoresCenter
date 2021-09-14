enum BILL_TYPE {
    PURCHASE = '1012',

}

enum BILL_STATUS {
    COMMITTED = 0,        // 已提交
    PASSED = 1,     // 审核通过
    FAILED = 2, // 审核退回
    UNDONE = 3,  // 已撤销
    NO_ACCEPT = 4,     // 未验收
    PART_ACCEPT = 5,// 异常验收
    FULL_ACCEPT = 6, // 正常验收
    APPLY = 7            // 申请状态
}

enum BILL_STATUS_READABLE{
    '已提交',
    '审核通过',
    '审核退回',
    '已撤销',
    '未验收',
    '部分验收',
    '完整验收',
    '申请状态'
}



export default {
    BILL_TYPE,
    BILL_STATUS,
    BILL_STATUS_READABLE

}
