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

// 数据采集上报
function collect(customData, eventType){
    let appId, pageId, timestamp, ua, currentUrl
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
    currentUrl = window.location.href
    // console.log(appId, pageId, timestamp, ua)
    let data = `appId=${appId}&pageId=${pageId}&timestamp=${timestamp}&ua=${ua}&eventType=${eventType}`
    const params = {appId, pageId, timestamp, ua, url: currentUrl, ...customData}
    data = qs.stringify(params)
    console.log('qsData', data)
    if(beforeUpload){
        data = beforeUpload(data)
    }
    // 日志上报
    let url, uploadData
    try{
        // data = {...customData, data}
        const res = upload(data)
        url = res.url
        uploadData = res.data
        // throw new Error('test')
    } catch (e) {
        onError(e)
    } finally {
        afterUpload && afterUpload(url, uploadData)
    }
}
// 发送 PV 日志
export function sendPV() { 
    collect({}, 'PV')
}
// 上报曝光埋点
export function sendExp(data) {
    collect(data, 'EXP')
}
// 上报点击埋点
export function sendClick(data = {}) {
    collect(data, 'CLICK')
}
export function sendCustom(data = {}) {
    collect(data, 'CUSTOM')
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

export function collectAppear() {
    const appearEvent = new CustomEvent('onAppear')
    const disappearEvent = new CustomEvent('onDisAppear')
    let ob
    if(window.MyCliMonitorObserver){
        ob = window.MyCliMonitorObserver
    }else {
        ob = new IntersectionObserver(function(e) {
            console.log('e -- collectAppear', e)
            e.forEach(d => {
                if(d.intersectionRatio > 0){
                    console.log(d.target.className + ' appear')
                    d.target.dispatchEvent(appearEvent)
                }else{
                    console.log(d.target.className + ' disappear!')
                    d.target.dispatchEvent(disappearEvent)
                }
            })
        })
    }
    let obList = []
    const appear = document.querySelectorAll('[appear]')
    for(let i = 0; i < appear.length; i++) {
        if(!obList.includes(appear[i])){
            ob.observe(appear[i])
            obList.push(appear[i])
        }
    }
    window.MyCliMonitorObserver = ob
    window.MyCliMonitorObserverList = obList
}

export default {
    
}