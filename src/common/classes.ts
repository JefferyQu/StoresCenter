class BILL {
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

    constructor() {
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

    addGoods(goods: any | Object[]): void {
        let that: any = this
        if (Array.isArray(goods)) {
            goods.forEach((gItem: object) => {
                let res: object | number = that.goodsList.find((item: object) => {
                    return item.pluCode === gItem.pluCode
                })

                if (!res || res === -1) {
                    that.goodsList.push(gItem)
                }
            })
        } else {
            let res: object | number = that.goodsList.find((item: object) => {
                return item.pluCode === goods.pluCode
            })

            if (!res || res === -1) {
                that.goodsList.push(goods)
            }
        }

    }


    delete(item: any): void {
        let that = this
        let index: number | undefined = that.children.find(function (cItem: any, index: number) {
            if (cItem.text === item.pluName)
                return index
        })

        if (index !== -1) {
            console.log('找到的 下标', index);
            that.children.splice(<number>index, 1)
        }


    }

}

export class purchaseBill extends BILL {
    vendorId: String
    vendorName: String

    constructor() {
        super()
        this.vendorId = ''
        this.vendorName = ''
    }
}

