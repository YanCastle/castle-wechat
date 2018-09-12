import axios from 'axios'
import { get_uuid } from 'castle-utils';
import * as jsonp from 'jsonp'
// import WxUploader from './WxUploader.vue'
declare const window: any;
declare const wx: any;
export var WechatID: string = '';
export var Server: string = 'http://api.tansuyun.cn/';
export var UUID = '';
export var BaiduMapAK = '';
export const IsWechatBrower = isWeixinBrowser();
export var jsConfiged = false;
export var UserInfo: any = false;
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
async function get(url) {
    return await request.get(url)
}
/**
 * 判断是否是微信浏览器
 */
export function isWeixinBrowser() {
    return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != null;
}
/**
 * 设置微信ID
 * @param WID 
 */
export function config(config: {
    WechatID: string,
    Server?: string,
    UUID?: string,
    BaiduMapAK?: string
}) {
    WechatID = config.WechatID;
    Server = config.Server || 'http://api.tansuyun.cn/'
    UUID = config.UUID || get_uuid();
    BaiduMapAK = config.BaiduMapAK
}
export async function user() {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    try {
        let UserInfo: any = await post('getLogined', {})
        if (UserInfo.d.openid) {
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
    if (config.d) {
        wx.config(config.d)
        jsConfiged = true;
    }
}
if (IsWechatBrower) {
    wx.ready(() => {
        jsConfig()
    })
}
/**
 * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
 * @param s 
 * @param e 
 */
export function location(s: (res: { latitude: number, longitude: number, speed: number, accuracy: number }) => void, e?: Function) {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    wx.getLocation({
        type: 'wgs84',
        success: (res: any) => {
            if (s instanceof Function) {
                jsonp("http://api.map.baidu.com/geoconv/v1/?coords=" + res.longitude + "," + res.latitude + "&from=1&to=5&ak=" + BaiduMapAK, null, (err, data) => {
                    if (!err) {
                        res.longitude = data.result[0].x
                        res.latitude = data.result[0].y
                        s(res)
                    } else {
                        if (e instanceof Function)
                            e(err)
                    }
                })
            }
        }
    })
}
export function scan(s: (result: string) => void, NeedResult: boolean = false, e?: Function) {
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
/**
 * 选择图片，弹出微信图片选择框
 * @param success 
 * @param count 
 */
export function chooseImage(success: (src: string[]) => void, count: number = 9) {
    wx.chooseImage({
        count: count || 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res: any) => {
            success(res.localIds)
        }
    })
}

/**
 * 上传图片
 * @param localIds  需要上传的图片的本地ID，由chooseImage接口获得
 * @param success 
 */
export function uploadImage(localIds: string[], success: (src: string[]) => void) {
    wx.uploadImage({
        localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: (res: any) => {
            success(res.serverId)
        }
    });
}
/**
 * 预览图片
 * @param current 当前显示图片的http链接
 * @param urls 需要预览的图片http链接列表
 */
export function previewImage(current: string, urls: string[]) {
    wx.previewImage({
        current: current,
        urls: urls
    })
}

export function install(Vue: any, options?: { WechatID: string, Server?: string }) {
    // Vue.component('WxUploader', WxUploader)
    if (options.WechatID) {
        config(options)
    }
}
export default {
    install
}