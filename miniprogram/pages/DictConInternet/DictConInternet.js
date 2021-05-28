// pages/DictConInternet/DictConInternet.js
// 连接数据库
const db = wx.cloud.database();
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wid: '',      //网络成语的id
    isColled:false,
    niceStc:["该部分尚未录入，敬请期待"],
    word:{},      //网络成语的内容
    sentence:{},  //好句，英文造句，中文造句
    navbar: ['释', '句', '典'],
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
        name:'中文释义',
        content:''
      }],
    content_2: ['造句'],
    content_3: ['出处'],
    currentTab: 0,
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
  },
  return_func:function(){
    wx.navigateBack({
      delta: 1
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
  navbarTap: function(e){
    var that = this
    // console.log(e)
    // wx.showToast({
    //   title: '页面切换到'+(e.currentTarget.dataset.idx+1),
    // })
    var index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index
    })
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
          // console.log(res)
          var niceStc = that.data.niceStc
          // niceStc[0] = res.list 
          if(res.list.length>0){
            niceStc = res.list
          }
          // niceStc =["你好","有点意思","hhhh"]
          // console.log(niceStc)
          that.setData({
            niceStc:niceStc
          })
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
    // console.log("_id:"+that.data._id)
    // 获取一个成语记录的数据
    db.collection('word_tb').aggregate()
    .match({
      wid: that.data.wid
    }).end().then( res => {  
        // console.log(res)
        that.setData({
          // theme : res.list
          word: res.list,
        })
        that.getContent_1()
        that.getContent_2()
    })

    //查看是否已经收藏
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
      arr.push(that.data.word[0].wname)
      arr.push(that.data.word[0].wpinyin)
      // arr.push(that.data.word[0].w_eng_interpre)
      arr.push(that.data.word[0].w_cn_interpre)
      // wname=that.data.word[0].wname
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
    arr.push(that.data.word[0].wname)
    arr.push(that.data.word[0].wpinyin)
    // arr.push(that.data.word[0].w_eng_interpre)
    arr.push(that.data.word[0].w_cn_interpre)
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