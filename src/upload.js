export function upload(data, options = {}) {
    // 数据上报
    let img = new Image()
    // event-type: PV、EXP、CLICK、CUSTOM
    const { eventType = 'PV' } = options
    const params = data + '&eventType=' + eventType
    const src = 'http://www.imooc.com?' + params
    img.src = src
    img = null // 释放内存
    return {
        url: src,
        data: {
            params
        }
    }
}

export default {}