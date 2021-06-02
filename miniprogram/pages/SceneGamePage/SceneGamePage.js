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
    ques_stc:"",
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
    this.getdbdata()
  },
  getdbdata:function(){
    var that = this
    const $ = db.command
      wx.cloud.callFunction({
        name:'randomSceneQues',
        data:{
          collection:'scene_game_tb',
          from:'word_tb',
          localField:'sg_answer_id',
          foreignField:'wid',
          as:'ques'
        },
        success:res=>{
          console.log(res.result.list[0])
          var realAnswer = res.result.list[0].ques[0];
          var ques = res.result.list[0].sg_ques_stc

          that.setData({
            ques_stc:ques,
          })
          //获取三个随机答案
          db.collection("word_tb").aggregate()
          .sample({
            size: 3
          })
          .match({
            wid:$.neq(realAnswer.wid)
          })
          .end().then(  res => { 
              var falseAnswer = res.list;
              var index = Math.floor(Math.random() * 4)
              var chooses = []
              var k = 0;
              for(var i =0;i<4;i++){
                if(index == i){
                  chooses.push(realAnswer);
                }else{
                  chooses.push(falseAnswer[k])
                  k = k+1
                }
              }
              that.setData({
                fakeAnswers:chooses,
                ques_stc:ques,
                ques_id: index
              })
          })
        }
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
  onShareAppMessage:function(res) {
    if (res.from == 'button') {
        console.log(res.target, res)
    }
    return {
      title:'快来加入我吧',
      path:"/pages/IntroPage/IntroPage",//这里是被分享的人点击进来之后的页面
      imageUrl: 'cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/global/logo.png'//这里是图片的路径
    }
  }

  // 游戏一关结束


})