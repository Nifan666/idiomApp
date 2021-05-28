// pages/DictConClassical/DictConClassical.js
// pages/DictConInternet/DictConInternet.js
// 连接数据库
const App = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wid: '',      //网络成语的id
    isColled:false,
    word:{},      //网络成语的内容
    sentence:{},  //好句，英文造句，中文造句
    navbar: ['释', '句', '典', '悟'],
    content_1: [
      {
        name:'成语名字',
        content:''
      },
      {
        name:'成语拼音',
        content:''
      },
      {
        name:'英文释义',
        content:''
      },
      {
        name:'中文释义',
        content:''
      }],
    content_2: [
      {
        name:'好句',
        content:'1'
      },
      {
        name:'英文造句',
        content:'2'
      },
      {
        name:'中文造句',
        content:'3'
      },
    ],
    content_3: ['成语典故'],
    content_4: ['释读'],
    currentTab: 0,
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    niceStc:[["该部分尚未录入，敬请期待"],["该部分尚未录入，敬请期待"],["该部分尚未录入，敬请期待"]]
  },
  return_func:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  navbarTap: function(e){
    
    // console.log(e)
    // wx.showToast({
    //   title: '页面切换到'+(e.currentTarget.dataset.idx+1),
    // })
    // console.log("跳跃界面"+e.currentTarget.dataset.idx)
    var that = this
    var index = e.currentTarget.dataset.idx
    
    if(index == 1){//好句界面
      //切换的时候查询
      var myid = this.data.wid
      // console.log("myid:"+myid)
      db.collection('cn_stc_tb').aggregate()
      .match({
        wid:myid
      })
      .end().then( res => {  
          // console.log("cn_stc_tb")
          console.log(res)
          var niceStc = that.data.niceStc
          // niceStc[0] = res.list 
          if(res.list.length>0){
            niceStc[0] = res.list
          }
          // niceStc[1] =["你好1","有点意思1","hhhh1"]
          // niceStc[2] =["你好2","有点意思2","hhhh2"] 
          // console.log(niceStc)
          that.setData({
            niceStc:niceStc
          })
      })
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    
  },
  changeCollState:function(){
    //更新
    var wid = this.data.wid
    var that = this
    if(this.data.isColled==false){
      db.collection('fav_tb').add({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          uid: App.globalData._openid,
          wid:wid,
          add_time:new Date()
        },
        success: function(res) {
          // console.log(res)
          that.setData({
            isColled:!that.data.isColled
          })
          wx.showToast({
            title: '成功收藏'
          })
          // console.log(that.data.isColled)
        } 
      })
    }else{
      // console.log("取消收藏")
      // console.log(App.globalData._openid)
      // console.log("wid"+wid)
      
      db.collection('fav_tb').where({
        uid: App.globalData._openid,
        wid:''+wid 
      }).remove({
        success: function(res) {
          // console.log(res)
          that.setData({
            isColled:!that.data.isColled
          })
          wx.showToast({
            title: '成功取消收藏'
          })
          // console.log(that.data.isColled)
        } 
      })
    }
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      wid: options.wid
    })
    // console.log("_id:"+that.data.wid)
    // 获取一个成语记录的数据，还需要和fav表做联表操作
    db.collection('word_tb').aggregate()
    .match({
      wid: that.data.wid
    }).end().then( res => {  
        // console.log(res.list[0])
        that.setData({
          // theme : res.list
          word: res.list[0],
        })
        //获取中文好句
        that.getContent_1()
        that.getContent_2()
    })
    //查看fav表是否有该信息
    db.collection('fav_tb').aggregate()
    .match({
      wid: that.data.wid,
      uid:App.globalData._openid
    }).end().then( res => {  
      if(res.list==0){
        that.setData({
          isColled:false
        })
      }else{
        that.setData({
          isColled:true
        })
      } 
    })

  },
  getContent_1:function(){
      var that = this
      var arr = new Array()
      arr.push(that.data.word.wname)
      arr.push(that.data.word.wpinyin)
      arr.push(that.data.word.w_eng_interpre)
      arr.push(that.data.word.w_cn_interpre)
      // wname=that.data.word.wname
      that.data.content_1.forEach((item,index) => {
        const title  = `content_1[${index}].content`
        that.setData({
          // [content] : "123"
          [title] : arr[index]
        })
    })
  },
  getContent_2:function(){
    var that = this
    var arr = new Array()
    arr.push(that.data.word.wname)
    arr.push(that.data.word.wpinyin)
    arr.push(that.data.word.w_eng_interpre)
    arr.push(that.data.word.w_cn_interpre)
    // wname=that.data.word[0].wname
    that.data.content_1.forEach((item,index) => {
        const title  = `content_1[${index}].content`
        that.setData({
          // [content] : "123"
          [title] : arr[index]
        })
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