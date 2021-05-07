var db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fakeAnswers: null,
    picUrls:["/images/game_item/red.png","/images/game_item/green.png","/images/game_item/yellow.png","/images/game_item/blue.png"],
    ques_id:null,
    iscenter:false,
    num:1,
    isOneEnd:false,
    isCorrect:true,
    correctTime:0,
    ques_stc:"外交调研是一门特殊的学问，既要善于__________，又不能听风便是雨。"
  },

  // 一题结束
  oneQuesEnd:function(){
    //如果游戏结束，进入结束界面
    console.log("一题结束")
    if(this.data.num == 2){
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
    var fakeAnswers=[
      {
        wpinyin:"hjkshakhsahk",
        wname:"衣食父母"
      },
      {
        wpinyin:"hjkshakhsahk",
        wname:"后古薄今"
      },
      {
        wpinyin:"hjkshakhsahk",
        wname:"狗尾续貂"
      },
      {
        wpinyin:"hjkshakhsahk",
        wname:"比能像见"
      }
    ]
    this.setData({
      fakeAnswers:fakeAnswers,
      ques_id:1
    })
  },
  getdbdata:function(){
    var that = this
    //获取正确的填词，随机获取   +  精准匹配一个单词
    var sceneTbCollection=db.collection('scene_game_tb');
    //初始化问题 + 中间ques的显示
    sceneTbCollection.aggregate()
      .sample({
        size: 1
      }).end().then(  res => {  
        that.data.fakeAnswers = []
        that.data.fakeAnswers.push(res.list[0])  //插入第一个元素

        //然后随机查找3个单词
        var sceneTbCollection=db.collection('scene_game_tb');
        //初始化问题 + 中间ques的显示
        sceneTbCollection.aggregate()
          .sample({
            size: 3
          }).end().then(  res => {  
            for(var item in res.list){
              that.data.fakeAnswers.push(item)  //插入随机生成的错误答案
            }
            //生成1-4不重复的数组
            var tarr = []  // 已经随机生成了
            var switchArr = []  //用于后面替换fakeArr的
            var i = 0
            for(var item in tarr){
              switchArr.push(fakeAnswers[item])
              if(item==0){
                that.setData({
                ques_id:i
                }) 
              }
              i = i+1
            }
            that.setData({
              fakeAnswers:switchArr,
              isOneEnd:false,
            })
            //---------- 答案生成结束-----------------------
          })
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