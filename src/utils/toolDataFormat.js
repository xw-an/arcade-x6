// 变量值格式化界面展示
export function formatValue  (val) {
    let result = ''
    if (val === null || val === undefined) {
        result = ''
    } else if (val instanceof Array || val instanceof Object){
        result = JSON.stringify(val)
    } else if (val instanceof Number) {
        result = Number(val)
    } else if (val instanceof String) {
        result = val.toString()
    } else if (val instanceof Boolean) {
        result = Boolean(val)
    } else {
        result = val
    }
    return result
}


// 变量值根据类型，转换为对应的值
export function formatValueByType (val,type) {
    if (type === 'java.lang.String') {
        return val.toString()
    } else if (type === 'java.lang.Boolean'){
        return Boolean(val)
    } else if (type === 'java.util.List' || type.indexOf('Object')!=-1) {
        return JSON.parse(val)
    } else if (type === 'int' || type === 'java.lang.Integer' || type === 'java.lang.Long' || type ==='long') {
        return Number(val)
    } else {
        return val
    }
}
