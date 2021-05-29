// pages/IntroPage/IntroPage.js
const App = getApp();
const db = wx.cloud.database();
// var plugin = requirePlugin("myPlugin"); 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // bg:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false，
    isShow:false,
    imageLoadNum:0
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // let val = '在微信智言与微信智聆两大技术的支持下，微信AI团队推出了“微信对话开放平台”和“腾讯小微”智能硬件两大核心产品。微信支付团队最新发布的“微信青蛙Pro”在现场设置了体验区，让大家感受AI认脸的本事。'
    // plugin.api.tokenize(val).then(e => {
    //   console.log(e)
    // })
  },
  imageLoad:function(){
    this.data.imageLoadNum++
    // console.log(this.data.imageLoadNum)
    if(this.data.imageLoadNum==4){
      // console.log("加载完成")
      this.setData({
        isShow:true
      })
    }
  }, 
  ToIndex:function(){
    wx.redirectTo({
      url: '/pages/HomePage/HomePage',
      fail(ex){
        wx.switchTab({
          url: '/pages/HomePage/HomePage',
        })
      }
    })
  }
})