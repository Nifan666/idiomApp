// pages/IntroPage/IntroPage.js
const App = getApp();
const db = wx.cloud.database();
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
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('user', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    //尚未完成
    // db.collection('user_tb').aggregate()
    // .match({
    //   _openid: App.globalData._openid 
    // }).end().then( res => { 
    //   console.log(res)
    //   //如果当前为空。执行插入
    //   if(res.length==0){
    //     db.collection('user_tb').insert({
    //       data: {
    //         _openid:App.globalData._openid,
    //         ava_url: e.detail.userInfo.avatarUrl,
    //         medal_num:0
    //       }
    //     })
    //     return ;
    //   }

    //   //如果不为空，执行更新
    //   db.collection('user_tb').where({
    //     _openid:App.globalData._openid 
    //   }).update({
    //     data: {
    //       ava_url: e.detail.userInfo.avatarUrl
    //     }
    //   })
    // })
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