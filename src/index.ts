import axios from 'axios'
declare const window: any;
declare const wx: any;
export var WechatID: string = '';
export var Server: string = 'http://api.tansuyun.cn/';
export var UUID = '';
export const IsWechatBrower = isWeixinBrowser();
const request = axios.create({
    withCredentials: true,
})
request.interceptors.response.use((response) => {
    return response.data;
})
export const Api = {
    onMenuShareTimeline: 'onMenuShareTimeline',
    onMenuShareAppMessage: 'onMenuShareAppMessage',
    onMenuShareQQ: 'onMenuShareQQ',
    onMenuShareWeibo: 'onMenuShareWeibo',
    onMenuShareQZone: 'onMenuShareQZone',
    startRecord: 'startRecord',
    stopRecord: 'stopRecord',
    onVoiceRecordEnd: 'onVoiceRecordEnd',
    playVoice: 'playVoice',
    pauseVoice: 'pauseVoice',
    stopVoice: 'stopVoice',
    onVoicePlayEnd: 'onVoicePlayEnd',
    uploadVoice: 'uploadVoice',
    downloadVoice: 'downloadVoice',
    chooseImage: 'chooseImage',
    previewImage: 'previewImage',
    uploadImage: 'uploadImage',
    downloadImage: 'downloadImage',
    translateVoice: 'translateVoice',
    getNetworkType: 'getNetworkType',
    openLocation: 'openLocation',
    getLocation: 'getLocation',
    hideOptionMenu: 'hideOptionMenu',
    showOptionMenu: 'showOptionMenu',
    hideMenuItems: 'hideMenuItems',
    showMenuItems: 'showMenuItems',
    hideAllNonBaseMenuItem: 'hideAllNonBaseMenuItem',
    showAllNonBaseMenuItem: 'showAllNonBaseMenuItem',
    closeWindow: 'closeWindow',
    scanQRCode: 'scanQRCode',
    chooseWXPay: 'chooseWXPay',
    openProductSpecificView: 'openProductSpecificView',
    addCard: 'addCard',
    chooseCard: 'chooseCard',
    openCard: 'openCard'
}

export const defaultApis = Object.keys(Api)
async function post(What: string, data?: any): Promise<any> {
    return await request.post(`${Server}Wechat/${What}/${WechatID}/${UUID}`, data);
}
/**
 * 判断是否是微信浏览器
 */
export function isWeixinBrowser() {
    return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
}
/**
 * 设置微信ID
 * @param WID 
 */
export function config(config: {
    WechatID: string,
    Server?: string,
    UUID?: string,
}) {
    WechatID = config.WechatID;
    Server = config.Server || 'http://api.tansuyun.cn/'
    UUID = config.UUID || uuid();
}
export async function user() {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    try {
        let UserInfo: any = await post('getLogined', {})
        if (UserInfo.openid) {
            return UserInfo;
        } else {
            window.location.href = `${Server}Wechat/user/${WechatID}/${UUID}`
        }
    } catch (error) {
        window.location.href = `${Server}Wechat/user/${WechatID}/${UUID}`
    }
}
export async function jsConfig() {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    let config = await post('jsConfig', { URL: window.location.href })
    if (config) {
        wx.config(config)
    }
}
export function location(s: Function, e: Function) {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    wx.getLocation({
        type: 'wgs84',
        success: (res: any) => {
            if (s instanceof Function) {
                s(res)
            }
        }
    })
}
export function scan(s: Function, NeedResult: boolean = false, e?: Function) {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    wx.scanQRCode({
        needResult: NeedResult ? 1 : 0,
        success: (d: any) => {
            if (s instanceof Function) {
                s(d.resultStr)
            }
        }
    })
}

/**
 * 关闭窗口
 */
export function close() {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    wx.closeWindow()
    if (wx && wx.closeWindow) { wx.closeWindow() }
}
export function hideMenuItems() {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    wx.hideMenuItems()
}
/**
 * 获取网络接口类型
 * @param {Function} s
 */
export function networkType(s: Function) {
    if (wx && wx.getNetworkType) {
        wx.getNetworkType({
            success: (d: any) => { if (s instanceof Function) s(d) }
        })
    }
}
function uuid() {
    var s: any = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010 
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01 
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}