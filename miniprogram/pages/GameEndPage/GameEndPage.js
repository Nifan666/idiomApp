// pages/GameEndPage/GameEndPage.js
var db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_openid:null,
    medal:{}
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
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        
       //oAU-j4oGWKda67QiUevq0ZbB8dKU
       //查询到openid   ->联表查询
       that.setData({
        user_openid:res.result.openid
       })
      console.log("opendid"+res.result.openid)
       wx.cloud.callFunction({
        name:'select_mpic',
        data:{
          collection:'user_tb',
          from:'medal_tb',
          localField:'medal_num',
          foreignField:'mid',
          as:'medeldetail',
          match:{_openid: res.result.openid}
        },
        success:res=>{
          //如果当前的res.result.list[0]==null
          // console.log(res.result.list[0].medeldetail[0].mpic)
          // that.setData({
          //   medal:res.result.list[0].medeldetail[0]
          // }) 
          var lis = res.result.list
          if(that.isEmpty(lis)|| lis.length==0 || that.isEmpty(lis[0].medeldetail) || lis[0].medeldetail.length==0){
            var tmedal = that.data.medal
            tmedal["mpic"] ="/images/game_item/medal1.jpg"
            that.setData({
              medal:tmedal
            })
          }else{
            that.setData({
              medal:lis[0].medeldetail[0]
            })
          }
          //更新
          var tmedal_num = parseInt(lis[0].medal_num)+1
          tmedal_num = tmedal_num.toString()
          db.collection('user_tb').where({
            _openid: that.data.user_openid
          }).update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              medal_num: tmedal_num
            },
            success: function(res) {
               
            }
          })

          console.log(res) 
        }
      })

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