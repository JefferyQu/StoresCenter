/*用户类*/
export class USER {
    username: string
    password: string
    orgId: string
    orgName: string
    panelModule: Array<object>

    constructor(param: USER) {
        this.username = param.username || ''
        this.password = param.password || ''
        this.orgId = param.orgId || ''
        this.orgName = param.orgName || ''
        this.panelModule = param.panelModule || []
    }
}

/*商品类*/
export class GOODS {
    pluCode: string
    pluName: string
    clsId: string
    clsName: string
    price: number
    vipPrice: number
    size: string
    unit: string
    orgId: string
    orgName: string
    imgUrl: string
    inventory: number
    publish: boolean

    constructor() {
        this.pluCode = ''
        this.pluName = ''
        this.clsId = ''
        this.clsName = ''
        this.price = 0
        this.vipPrice = 0
        this.size = ''
        this.unit = ''
        this.orgId = ''
        this.orgName = ''
        this.imgUrl = ''
        this.inventory = 0
        this.publish = false
    }

}

/*订单接口*/
interface BILL {
    billCode: String
    billType: String
    orgId: String
    orgName: String
    maker: String
    createTime: String
    handleTime: String
    status: number
    remark: String
    goodsList: Object[]

    addGoods(goods: GOODS | GOODS[]): void

    deleteGoods(item: any): void
}

/*订单抽象类*/
abstract class BILL_IMPL implements BILL {
    billCode: String
    billType: String
    orgId: String
    orgName: String
    maker: String
    createTime: String
    handleTime: String
    status: number
    remark: String
    goodsList: Object[]

    protected constructor() {
        this.billCode = ''
        this.billType = ''
        this.orgId = ''
        this.orgName = ''
        this.maker = ''
        this.createTime = ''
        this.handleTime = ''
        this.status = 0
        this.remark = ''
        this.goodsList = []
    }

    addGoods(goods: GOODS | GOODS[]): void {
        let that: any = this
        if (Array.isArray(goods)) {
            goods.forEach((gItem: any) => {
                let res: object | number = that.goodsList.find((item: any) => {
                    return item.pluCode === gItem.pluCode
                })

                if (!res || res === -1) {
                    that.goodsList.push(gItem)
                }
            })
        } else {
            let res: object | number = that.goodsList.find((item: any) => {
                return item.pluCode === goods.pluCode
            })

            if (!res || res === -1) {
                that.goodsList.push(goods)
            }
        }

    }


    deleteGoods(goods: GOODS | GOODS[]): void {
        let that: any = this
        let index: number | undefined = that.children.find(function (cItem: any, index: number, arr: Array<GOODS>) {
            if (cItem.text === item.pluName)
                return index
        })


    }

}

/*要货单*/
export class PURCHASE_BILL extends BILL_IMPL {
    vendorId: String
    vendorName: String

    constructor() {
        super()
        this.vendorId = ''
        this.vendorName = ''
    }
}

