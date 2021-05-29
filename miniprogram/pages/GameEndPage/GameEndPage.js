// pages/GameEndPage/GameEndPage.js
var db = wx.cloud.database();
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_openid:null,
    medal:{},
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    isCollAll:false
  },
  backGameChoose:function(){
    wx.switchTab({
      url: '/pages/GameChoosePage/GameChoosePage'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取图片url
    let that = this
    var user_openid = null;
    //先查询是否有该用户
    db.collection('user_tb').aggregate()
    .match({
      _openid:App.globalData._openid
    }).end().then(  res => { 
      if(res.list.length==0){
        // console.log("插入")
        //插入当前的成绩 --------------------------------------  未作--------------------------------------
        db.collection('user_tb').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            uid:App.globalData._openid,
            ava_url:"",
            medal_num:1
          },
          success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            // console.log(res)
            var tmedal = that.data.medal
            tmedal["mpic"] ="/Medal_pic/medal1.jpg"
            that.setData({
              medal:tmedal
            })
          }
        })
      }else{
        //更新当前的成绩,查询 勋章 + 更新成绩
        var tmedal = that.data.medal
        //如果本来成绩为0，就更新为1
        if(res.list[0].medel_num==0){
          tmedal["mpic"] ="/Medal_pic/medal1.jpg"
          that.setData({
            medal:tmedal
          })
          db.collection('user_tb').where({
            _openid: that.data.user_openid
          }).update({ 
            data: {
              medal_num:1
            },
            success: function(res) {
              
            }
          })
        }else{
          var tmedal_num = parseInt(res.list[0].medal_num)+1
          // console.log(tmedal_num)
          //如果勋章大于10，就抛弃 -- 不再更新
          if(tmedal_num>10){
            tmedal["mpic"] ="/Medal_pic/medal"+10+".jpg"
            that.setData({
              medal:tmedal,
              isCollAll:true
            })
          }else{
            //如果勋章不于10，就更新
            db.collection('user_tb').where({
              _openid: that.data.user_openid
            }).update({ 
              data: {
                medal_num: parseInt(tmedal_num)
              },
              success: function(res) {
                // console.log("更新了")
                tmedal["mpic"] ="/Medal_pic/medal"+tmedal_num+".jpg"
                that.setData({
                  medal:tmedal
                })
              }
            })
          }
        }
      }
    })

    
  } ,
    
isEmpty:function(str){
  var tmp = null; 
  if (!tmp && typeof(tmp)!="undefined" && tmp!=0){ 
    return false;
  }
  return true;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})