// pages/RankPage/RankPage.js 
var db = wx.cloud.database();

const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:null,
    imageUrl:null,
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/UserInfoPage",
    rank_last:-1,
    openid:App.globalData._openid
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
    
    //查询用户排名
    var _ = db.command
    var that = this
    var openid = App.globalData._openid;
    //只取前4个
    db.collection('user_tb').aggregate()
    .sort({
      medal_num: -1 
    })
    .limit(5)
    .end().then(  res => {  
      // console.log(res.list)
      //如果前4名当中没有本人，就添加本人
      //如果前5名有本人，就放本人，不操作
      // that.setData({
      //   users:res.list
      // })
      // console.log(res.list)
      var users = res.list
      // //先比较前5人内是否有自己
      var isTop5 = false;
      for(var i=0;i<users.length;i++){
        if(users[i]._openid == openid){
          //不处理
          isTop5=true
        }
      }

      //不是前5，就将第5个人替换成本人，顺便表示本人排名
      if(!isTop5){
        const _ = db.command
        console.log(isTop5)
        //先查本人的金牌数，再统计比本人金牌数多的
        db.collection('user_tb').where({
          _openid: openid
        }).get({
          success: function(res) {
            
            var user = res.data[0]
            //把排名呈现出来
            //直接插入 + 本人总排名
            if(users.length<5){
              users.push(user);
            }
            else{//更新掉最后一个人的成绩
              users[4] = user
            }
            //再统计当前的排名
            db.collection('user_tb').where({
              medal_num:_.gt(parseInt(user.medal_num))
            }).count( ).then(res=>{
                that.setData({
                  users:users,
                  rank_last:res.total,
                  openid:App.globalData._openid
                }) 
            })
          }
        })
      }else{
        that.setData({
          users:users,
          openid:App.globalData._openid
        })    
      }
    })
    

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