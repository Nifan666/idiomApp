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
    mpicDir:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/",
    isLoading:true,
    imgNum:0
  },
  return_func:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  imageLoad:function(){
    this.data.imgNum++
    // console.log(this.data)
    if(this.data.imgNum==this.data.medal_num){
      this.setData({
        isLoading:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLoading:true
    })
    var that = this
    const _ = db.command
    db.collection('user_tb').aggregate()
    .match({
      _openid:App.globalData._openid
    }).end().then( res => {  
        // res.data 是包含以上定义的两条记录的数组
        //获取图片信息
        // console.log(res)
        if(res.list.length>0){
          // console.log(res.list[0])
          if(res.list[0].medal_num==0){
            that.setData({
              medals:[],
              medal_num:0,
              isLoading:false
            })
          }
          db.collection('medal_tb').aggregate()
          .match({
            mid:_.lte(parseInt(res.list[0].medal_num))
          }).sort({
            mid:-1
          }).end().then( res => {
            // console.log(res)
            that.setData({
              medals:res.list,
              medal_num:res.list.length
            })
          })
        }else{
          that.setData({
            medals:[],
            medal_num:0,
            isLoading:false
          })
        }
    })
  }

})