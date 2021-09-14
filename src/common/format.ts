export function dateFormat(date: number | string, format: string) {
    let time = new Date(Number(date))
    let yy = time.getFullYear()
    let MM = time.getMonth() + 1
    let dd = time.getDate()
    let hh = time.getHours()
    let mm = time.getMinutes()
    let ss = time.getSeconds()
    switch (format) {
        case 'yyyy-mm':
            return yy + '-' + MM
        case 'yyyy-mm-dd':
            return yy + '-' + MM + '-' + dd
        case 'yyyy-mm-dd hh:mm':
            return yy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm
        case 'yyyy-mm-dd hh:mm:ss':
            return yy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
        default:
            return '调用格式不正确'
    }

}
