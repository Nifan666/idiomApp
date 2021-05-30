var db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fakeAnswers: null,
    picUrls:["/game_item/red.png","/game_item/green.png","/game_item/yellow.png","/game_item/blue.png"],
    ques_id:null,
    iscenter:false,
    num:1,
    isOneEnd:false,
    isCorrect:true,
    correctTime:0,
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/GameChoosePage"
  },
  // 一题结束
  oneQuesEnd:function(){
    //如果游戏结束，进入结束界面
    console.log("一题结束")
    if(this.data.num == 20){
      console.log("通关完成,跳转到结束页面")
      wx.navigateTo({
        url: '/pages/GameEndPage/GameEndPage',
      })
    }else{
      //问题是否居中 + 进入下一关
      var t = this.data.num+1;
      this.setData({
        isOneEnd:false,
        num:t
      })
      this.initPage()  // 重新初始化界面
    }

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage()
  },
  initPage:function(){
    var wordTbCollection=db.collection('word_tb');
    //初始化问题 + 中间ques的显示
    wordTbCollection.aggregate()
      .sample({
        size: 4
      }).end().then(  res => {  
        this.setData({
          fakeAnswers:res.list,
          //生成随机问题id
          ques_id : Math.floor(Math.random() * 4)
        }) 
        if(this.data.fakeAnswers[this.data.ques_id].w_eng_interpre.length<30){
          this.setData({
            iscenter:true ,
            isOneEnd:false,
            isCorrect:true
          })
        }else{
          this.setData({
            iscenter:false,
            isOneEnd:false,
            isCorrect:true
          })
        }
        // console.log(this.data.iscenter);
        //   console.log(res.list);   
      }) 
  },
  return_func:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  clickAnser:function(e){
    if(this.data.ques_id == e.currentTarget.dataset['index']){
      //如果正确
      this.data.correctTime  = this.data.correctTime+1
      this.setData({
        isOneEnd:true,
        isCorrect:true
      })
    } else{
      //错误的话
      this.setData({
        isOneEnd:true,
        isCorrect:false
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  // 游戏一关结束


})