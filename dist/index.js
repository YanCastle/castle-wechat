"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const castle_utils_1 = require("castle-utils");
exports.WechatID = '';
exports.Server = 'http://api.tansuyun.cn/';
exports.UUID = '';
exports.BaiduMapAK = '';
exports.IsWechatBrower = isWeixinBrowser();
exports.jsConfiged = false;
exports.UserInfo = false;
const request = axios_1.default.create({
    withCredentials: true,
});
request.interceptors.response.use((response) => {
    return response.data;
});
exports.Api = {
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
};
exports.defaultApis = Object.keys(exports.Api);
async function post(What, data) {
    return await request.post(`${exports.Server}Wechat/${What}/${exports.WechatID}/${exports.UUID}`, data);
}
async function get(url) {
    return await request.get(url);
}
function isWeixinBrowser() {
    return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != null;
}
exports.isWeixinBrowser = isWeixinBrowser;
function config(config) {
    exports.WechatID = config.WechatID;
    exports.Server = config.Server || 'https://api.tansuyun.cn/';
    exports.UUID = config.UUID || castle_utils_1.get_uuid();
    exports.BaiduMapAK = config.BaiduMapAK;
}
exports.config = config;
async function user() {
    if (!exports.IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    try {
        let UserInfo = await post('getLogined', {});
        if (UserInfo.d.openid) {
            return UserInfo;
        }
        else {
            window.location.href = `${exports.Server}Wechat/user/${exports.WechatID}/${exports.UUID}?r=${encodeURIComponent(window.location.href)}`;
        }
    }
    catch (error) {
        window.location.href = `${exports.Server}Wechat/user/${exports.WechatID}/${exports.UUID}?r=${encodeURIComponent(window.location.href)}`;
    }
}
exports.user = user;
async function jsConfig() {
    if (!exports.IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    let config = await post('jsConfig', { URL: window.location.href });
    if (config.d) {
        wx.config(config.d);
        exports.jsConfiged = true;
    }
}
exports.jsConfig = jsConfig;
if (exports.IsWechatBrower) {
    wx.ready(() => {
        jsConfig();
    });
}
function location() {
    if (!exports.IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    let finish = false;
    return new Promise((s, j) => {
        setTimeout(() => {
            if (!finish) {
                finish = true;
                j('定位超时');
            }
        }, 1500);
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                if (!finish) {
                    finish = true;
                    if (res.errMsg.indexOf("ok")) {
                        s(res);
                    }
                    else {
                        j(res);
                    }
                }
            }
        });
    });
}
exports.location = location;
function scan(NeedResult = false) {
    if (!exports.IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    return new Promise((s, j) => {
        wx.scanQRCode({
            needResult: NeedResult ? 1 : 0,
            success: (d) => {
                s(d.resultStr);
            }
        });
    });
}
exports.scan = scan;
function close() {
    if (!exports.IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    wx.closeWindow();
    if (wx && wx.closeWindow) {
        wx.closeWindow();
    }
}
exports.close = close;
function hideMenuItems() {
    if (!exports.IsWechatBrower) {
        throw new Error('NOT_WECHAT_BROWER');
    }
    wx.hideMenuItems();
}
exports.hideMenuItems = hideMenuItems;
function networkType() {
    return new Promise((s, j) => {
        if (wx && wx.getNetworkType) {
            wx.getNetworkType({
                success: (d) => { s(d); }
            });
        }
    });
}
exports.networkType = networkType;
function chooseImage(count = 9) {
    return new Promise((s, j) => {
        wx.chooseImage({
            count: count || 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                s(res.localIds);
            }
        });
    });
}
exports.chooseImage = chooseImage;
function uploadImage(localIds) {
    return new Promise((s, j) => {
        wx.uploadImage({
            localId: localIds,
            isShowProgressTips: 1,
            success: (res) => {
                s(res.serverId);
            }
        });
    });
}
exports.uploadImage = uploadImage;
function previewImage(current, urls) {
    wx.previewImage({
        current: current,
        urls: urls
    });
}
exports.previewImage = previewImage;
function install(Vue, options) {
    if (options.WechatID) {
        config(options);
    }
}
exports.install = install;
exports.default = {
    install
};
//# sourceMappingURL=index.js.map