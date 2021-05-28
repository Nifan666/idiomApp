// app.js
App({
  onLaunch() {
    wx.hideShareMenu()
    var that = this
    // 展示本地存储能力
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: 'cloud1-8g8oiizf3797896b',
      traceUser: true,
    }); 

    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.cloud.callFunction({
          name: 'login',
          complete: res => { 
            this.globalData._openid= res.result.openid;
          }
         }) 
      }
    })


    

  },
  globalData: {
    userInfo: null,
    _openid:null
  }
})
