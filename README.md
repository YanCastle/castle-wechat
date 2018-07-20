# castle-wechat 使用说明
## 注意事项
1. 该组件需要配合服务端使用，服务程序暂不开源，如需合作请联系18990191742

## 使用方式
1. 安装
```typescript
npm i -D castle-wechat
```
2. 导入
```typescript
import Wechat,{
  IsWechatBrower,
  user,
  config,
  jsConfig,
  location
} from "castle-wechat";
```
3. 在App.vue中的created中完成配置，或在main.ts中
```typescript
if (IsWechatBrower) {
    await config({
    WechatID: "gh_339982221ea7",
    Server: "http://wx.dev.tansuyun.cn/",
    UUID: '',//来自本地缓存的用户的UUID信息
    BaiduMapAK:'',//百度Map的AK
    });
    let UserInfo = await user();
    //获得用户信息后请保存到Vuex中或其它地方
    jsConfig();
} else {
}
```
4. 使用其它需要的接口