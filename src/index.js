import { sendPV, sendExp, sendClick, collectAppear, registerBeforeCreateParams, registerBeforeUpload, registerAfterUpload, registerOnError } from "./collect";
import { upload } from './upload'

const appearEvent = new CustomEvent('onAppear')
const disappearEvent = new CustomEvent('onDisAppear')
const ob = new IntersectionObserver(function(e) {
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
const appear = document.querySelectorAll('[appear]')
for(let i = 0; i < appear.length; i++) {
    ob.observe(appear[i])
}

window.onload = function() {
    collectAppear()
}

window.MyCliMonitor = {
    // collect,
    registerBeforeCreateParams,
    registerBeforeUpload,
    registerAfterUpload,
    registerOnError,
    sendPV,
    sendExp,
    sendClick,
    collectAppear,
    upload,
}