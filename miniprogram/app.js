//app.js
var plugin = requirePlugin("myPlugin"); 
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

            plugin.init({
              appid: "P5Ot9PHJDechCYqDFAW1AiK6OtG3Ja", //小程序示例账户，仅供学习和参考
              openid: res.result.openid, //用户的openid，非必填，建议传递该参数
              success: () => {}, //非必填
              fail: (error) => {}, //非必填
            });


          }
         }) 
      }
    })
    
  },
  onShareAppMessage:function(res) {
    if (res.from == 'button') {
        console.log(res.target, res)
    }
    return {
      title:'快来加入我吧',
      path:'"pages/IntroPage/IntroPage",',//这里是被分享的人点击进来之后的页面
      imageUrl: 'cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/Scan/scan.png'//这里是图片的路径
    }
  }, 
   
  globalData: {
    userInfo: null,
    _openid:null
  }
})
