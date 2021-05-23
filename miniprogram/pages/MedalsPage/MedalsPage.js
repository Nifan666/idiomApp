// pages/MedalsPage/MedalsPage.js
var db = wx.cloud.database();
var App = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    
    medal_num:15,
    medals:null,
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/UserInfoPage",
    mpicDir:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/"
  },
  return_func:function(){
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    const _ = db.command
    db.collection('user_tb').where({
      _openid:App.globalData._openid
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        //获取图片信息
        if(res.data.length>0){
          console.log(res.data[0])
          db.collection('medal_tb').where({
            mid:_.lte(parseInt(res.data[0].medal_num))
          }) .orderBy('mid', 'asc')
          .get({
            success:function(res){
              that.setData({
                medals:res.data,
                medal_num:res.data.length
              })
            }
          })
        }
        
      }
    })


  }

})