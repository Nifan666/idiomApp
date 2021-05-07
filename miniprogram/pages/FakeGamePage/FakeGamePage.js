// pages/FakeGamePage/FakeGamePage.js
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
    num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage();
  },
  initPage:function(){
    //读取数据库，获取题目
    var right_answer = "欢度春节"
    var false_answer = "欢渡春节"
    var tarr = []
    var ques_id = Math.floor(Math.random() * 2)-1 //0-1之间 -  指定正确答案的位置
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
  },
  btnclick:function(e){
    var clickId = e.currentTarget.dataset['index']
    if(this.data.num == 2){
      console.log("通关完成,跳转到结束页面") 
      wx.navigateTo({
        url: '/pages/GameEndPage/GameEndPage?',
      })
    }
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
    var that = this
    setTimeout(function () {
      //要延时执行的代码
      that.initPage()
     }, 800) //延迟时间 这里是2秒

    
  },
  oneQuesEnd:function(){

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