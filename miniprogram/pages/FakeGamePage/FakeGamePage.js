// pages/FakeGamePage/FakeGamePage.js
var db = wx.cloud.database();
Page({
  return_func:function(){
    wx.navigateBack({
      delta: 2
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    answers:[],
    ques_id :0,
    isOneEnd:false,
    isCorrect:false,
    num:0,
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/GameChoosePage"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage();
  },
  initPage:function(){
    //读取数据库，获取题目
    db.collection("fake_game_tb").aggregate()
    .sample({
      size: 1
    }).end().then(  res => {  
      // console.log(res.list[0])
      var right_answer = res.list[0].fg_real_word
      var false_answer = res.list[0].fg_fake_word
      var tarr = []
      var ques_id = Math.floor(Math.random() * 2) //0-1之间 -  指定正确答案的位置
      if(ques_id==0){
        tarr.push(right_answer)
        tarr.push(false_answer)
      }else{
        tarr.push(false_answer)
        tarr.push(right_answer)
      }
      this.setData({
        answers : tarr,
        ques_id :ques_id ,
        isOneEnd:false,
        isCorrect:false
      })

    })
    
    
  },
  btnclick:function(e){
    var that = this
    var clickId = e.currentTarget.dataset['index']
    var num = this.data.num
    if(this.data.ques_id == clickId){
      //如果正确 
      this.setData({
        isOneEnd:true,
        isCorrect:true,
        num:num+1
      })
    } else{
      //错误的话
      this.setData({
        isOneEnd:true,
        isCorrect:false,
        num:num+1
      })
    }
    if(this.data.num == 1){
      // console.log("通关完成,跳转到结束页面") 
      //等待2s钟
      var time = setTimeout(function () {
        wx.navigateTo({
          url: '/pages/GameEndPage/GameEndPage?',
        })
       }, 800) //延迟时间 这里是2秒
    }else{
      setTimeout(function () {
        //要延时执行的代码
        that.initPage()
      }, 700) //延迟时间 这里是2秒
    }
    
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})