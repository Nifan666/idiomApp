// pages/UserInfoPage/UserInfoPage.js
var db = wx.cloud.database();
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/UserInfoPage",
     
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false, 
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('notFirst')){
      console.log(wx.getStorageSync('user'))
      this.setData({
        userInfo:wx.getStorageSync('user'),
        canIUseGetUserProfile: true,
        hasUserInfo:true
      })
      // console.log(this.data.userInfo)
    } else{
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage:function(res) {
    if (res.from == 'button') {
        console.log(res.target, res)
    }
    return {
      title:'快来加入我吧',
      path:"/pages/IntroPage/IntroPage",//这里是被分享的人点击进来之后的页面
      imageUrl: 'cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/global/logo.png'//这里是图片的路径
    }
  },
 

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    var that = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.getMyUserInfo(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    }) 
    this.getMyUserInfo( e.detail.userInfo)
  },
  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  //   // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       user = res.userInfo
  //       this.getMyUserInfo(user)
  //     }
  //   })
  // },

  getMyUserInfo:function(user){
    if(user==null){
      return;
    }
    // console.log(user)

    //此时可能之前已经更新过了
    db.collection('user_tb').aggregate()
    .match({
      uid:App.globalData._openid
    }).end().then(  res => { 
      if(res.list.length>0){
        //如果之前更新过
        db.collection('user_tb').where({
          uid:App.globalData._openid,
        }).update({
          data: {
            ava_url: user.avatarUrl
          },
          success: function(res) {
            // console.log(res)
            wx.setStorageSync('notFirst', true)
            wx.setStorageSync('user',user) 
          }
        }) 
      }else{
        //没有放入过数据库，就添加到数据库内
        //如果同意就获取当前的 用户的信息，并且把 第一次登入 变成 第二次登录
        // console.log(App.globalData._openid)
        db.collection('user_tb').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            uid:App.globalData._openid,
            ava_url:user.avatarUrl,
            medal_num:0
          }
        }).then(res=>{
          // console.log(res)
            wx.setStorageSync('notFirst', true)
            wx.setStorageSync('user',user) 
        })
      }
    })
  },
  
})