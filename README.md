# castle-wechat 使用说明
## 注意事项
1. 该组件需要配合服务端使用，服务程序暂不开源，如需合作请联系18990191742

## 使用方式
1. 安装
```typescript
yarn add -D @ctsy/wechat
// npm i -D @ctsy/wechat
// cdn 引入:https://npm.taobao.org/@ctsy/wechat/dist/main.min.js
```
2. 导入
```typescript
import Wechat,{
  IsWechatBrower,
  user,
  config,
  jsConfig,
  location
} from "@ctsy/wechat";
```
3. 在App.vue中的created中完成配置，或在main.ts中
```typescript
if (IsWechatBrower) {
    await config({
      WechatID: "gh_339982221ea7",
      UUID: '',//来自本地缓存的用户的UUID信息
      BaiduMapAK:'',//百度Map的AK
    });
    let UserInfo = await user();
    //获得用户信息后请保存到Vuex中或其它地方
    jsConfig();
} else {
}
```
4. 结合vue-router拦截器使用
```typescript
router.beforeEach(async (to, from, next) => {
  //可以在此处提示正在请求认证
  if (IsWechatBrower && !window.Store.state.User.Wechat.openid) {
    let { d } = await user()
    window.Store.commit('M_USER_WECHAT', d)
  }
}
```
5. 使用其它需要的接口