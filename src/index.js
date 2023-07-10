import { sendPV, registerBeforeCreateParams, registerBeforeUpload, registerAfterUpload, registerOnError } from "./collect";
import { upload } from './upload'

window.MyCliMonitor = {
    // collect,
    registerBeforeCreateParams,
    registerBeforeUpload,
    registerAfterUpload,
    registerOnError,
    sendPV,
    upload,
}