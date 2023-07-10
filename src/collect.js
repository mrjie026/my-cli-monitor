import { upload } from "./upload"
import qs from 'qs'
// 参数创建前
let beforeCreateParams
// 上报日志前
let beforeUpload
// 上报日志后
let afterUpload
// 异常处理
let onError = function(e) {
    console.error(e)
}

export function collect() {
    // 数据采集
    console.log('collect')
}
export function sendPV(){
    let appId, pageId, timestamp, ua
    beforeCreateParams && beforeCreateParams()
    // 发送PV日志 - 采集页面基本信息：
    // 1. 应用 
    // 2. 页面
    const mateList = document.getElementsByTagName('meta')
    for (let i = 0; i < mateList.length; i++) {
        const mate = mateList[i]
        if(mate.getAttribute('my-app-id')){
            appId = mate.getAttribute('my-app-id')
        }
    }
    const body = document.body
    pageId = body.getAttribute('my-page-id')
    if(!appId || !pageId) return
    timestamp = new Date().getTime()
    ua = window.navigator.userAgent
    console.log(appId, pageId, timestamp, ua)
    let data = `appId=${appId}&pageId=${pageId}&timestamp=${timestamp}&ua=${ua}`
    const params = {appId, pageId, timestamp, ua}
    const qsData = qs.stringify(params)
    console.log('qsData', qsData)
    if(beforeUpload){
        data = beforeUpload(data)
    }
    // 日志上报
    let url, uploadData
    try{
        const res = upload(data)
        url = res.url
        uploadData = res.data
        throw new Error('test')
    } catch (e) {
        onError(e)
    } finally {
        afterUpload && afterUpload(url, uploadData)
    }
}

export function registerBeforeCreateParams(fn){
    beforeCreateParams = fn
}

export function registerBeforeUpload(fn){
    beforeUpload = fn
}

export function registerAfterUpload(fn) {
    afterUpload = fn
}

export function registerOnError(fn) {
    onError = fn
}

export default {
    
}