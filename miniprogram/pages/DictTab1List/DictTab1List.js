// pages/DictTab1List/DictTab1List.js
// 连接数据库
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    word_list:[],     //大主题的小分类对应的成语list
    theme_id: '',
    son_theme_id: '',
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    isLoading:true,
    isSearch:false,
    son_theme_name:""
  },
  // 获取搜索文本框内容
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail
    })
    },
  onCancel:function(){
    if(this.data.isSearch==false){
      return ;
    }
    var that = this
    this.setData({
      isLoading:true
    })
    db.collection('word_tb').aggregate()
    .match({
      theme_id: that.data.theme_id,
      son_theme_id: that.data.son_theme_id
    })
    .limit(10000)
    .end().then( res => {  
        // console.log(res)
        that.setData({
          // theme : res.list
          word_list: res.list,
          isLoading:false,
          isSearch:false
        })
    })
  },
  // 搜索文本框内容
  goToSearch:function(e){
    var that = this
    var key = this.data.inputValue
    if(key==null || key.length==0 ||key==""){
      this.onCancel()
      return ;
    }

    this.setData({
      isLoading:true
    })
    db.collection('word_tb').aggregate()
    .match({
      'wname': {
        $regex: '.*' + key + '.*', //.*等同于SQL中的%
        $options: 'i' //$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      },
      w_type:'0'
    })
    .limit(10000)
    .end().then( res => {  
        // console.log(res)
        that.setData({
          word_list: res.list,
          isLoading:false,
          isSearch:true
        })
    })
    // console.log(this.data.inputValue)
    // wx.showToast({
    //   title: '输入'+this.data.inputValue,
    // })
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
    
    var that = this
    that.setData({
      theme_id: options.theme_id,
      son_theme_id: options.son_theme_id,
      son_theme_name:options.son_theme_name
    })

    // console.log("theme_id:"+that.data.theme_id)
    // console.log("son_theme_id:"+that.data.son_theme_id)

    db.collection('word_tb').aggregate()
    .match({
      theme_id: that.data.theme_id,
      son_theme_id: that.data.son_theme_id
    })
    .limit(10000)
    .end().then( res => {  
        // console.log(res)
        that.setData({
          // theme : res.list
          word_list: res.list,
          isLoading:false
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
})