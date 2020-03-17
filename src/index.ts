import axios from 'axios'
import { get_uuid } from 'castle-utils';
declare const window: any;
declare const wx: any;
declare const setTimeout: any;
export var WechatID: string = '';
export var Server: string = 'https://v1.api.tansuyun.cn/';
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
async function post(Where: string, What: string, data?: any): Promise<any> {
    return await request.post([Server, '_wechat', Where, What, WechatID, UUID].join('/').replace('//_wechat', '/_wechat'), data);
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
    if (config.Server)
        Server = config.Server;
    UUID = config.UUID || get_uuid();
    BaiduMapAK = config.BaiduMapAK
}
/**
 * 获取用户认证信息
 */
export async function user() {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    let url = [Server, '_wechat', 'Auth', 'user', WechatID, UUID].join('/').replace('//_wechat', '/_wechat') + `?r=${encodeURIComponent(window.location.href)}`
    try {
        let UserInfo: any = await post('Auth', 'getLogined', {})
        if (UserInfo.d.openid) {
            return UserInfo;
        } else {
            window.location.href = url;
        }
    } catch (error) {
        window.location.href = url;
    }
}
/**
 * jsConfig
 */
export async function jsConfig() {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    if (jsConfiged) { return true; }
    let config = await post('Js', 'jsConfig', { URL: window.location.href })
    if (config.d) {
        wx.config(config.d)
        return jsConfiged = true;
    }
}
if (IsWechatBrower) {
    wx.ready(() => {
        jsConfig()
    })
}
/**
 * 定位
 * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
 * @param s 
 * @param e 
 */
export function location(): Promise<{ latitude: number, longitude: number, speed: number, accuracy: number }> {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    let finish = false;
    return new Promise((s, j) => {
        setTimeout(() => {
            if (!finish) {
                finish = true;
                j('定位超时')
            }
        }, 1500)
        wx.getLocation({
            type: 'wgs84',
            success: (res: any) => {
                if (!finish) {
                    finish = true;
                    if (res.errMsg.indexOf("ok")) {
                        s(res);
                    } else {
                        j(res);
                    }
                }
            }
        })
    })
}
export function scan(NeedResult: boolean = false): Promise<string> {
    if (!IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    return new Promise((s, j) => {
        wx.scanQRCode({
            needResult: NeedResult ? 1 : 0,
            success: (d: any) => {
                s(d.resultStr)
            }
        })
    })
}
/**
 * 分享接口
 * @param title 分享标题
 * @param desc 分享描述
 * @param link 跳转链接，必须是授权的域名
 * @param imgUrl 图标
 */
export function share(title: string, desc: string, link: string, imgUrl: string) {
    return new Promise((s, j) => {
        let i = 0;
        function success() {
            if (++i > 1) {
                s();
            }
        }
        wx.updateAppMessageShareData({
            title, // 分享标题
            desc, // 分享描述
            link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl, // 分享图标
            success
        })
        wx.updateTimelineShareData({
            title, // 分享标题
            link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl, // 分享图标
            success
        })
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
export function networkType() {
    return new Promise((s, j) => {
        if (wx && wx.getNetworkType) {
            wx.getNetworkType({
                success: (d: any) => { s(d) }
            })
        }
    })
}
/**
 * 选择图片，弹出微信图片选择框
 * @param success 
 * @param count 
 */
export function chooseImage(count: number = 9): Promise<string[]> {
    return new Promise((s, j) => {
        wx.chooseImage({
            count: count || 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res: any) => {
                s(res.localIds)
            }
        })
    })
}

/**
 * 上传图片
 * @param localIds  需要上传的图片的本地ID，由chooseImage接口获得
 * @param success 
 */
export function uploadImage(localIds: string[]): Promise<string[]> {
    return new Promise((s, j) => {
        wx.uploadImage({
            localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res: any) => {
                s(res.serverId)
                // success(res.serverId)
            }
        });
    })
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
    Vue.$wx = wx;
    if (options.WechatID) {
        config(options)
    }
}
export default {
    install
}
if (window) {
    window.ctsywechat = {
        install,
    }
}