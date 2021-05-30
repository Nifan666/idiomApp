// pages/IdiomDictTab1/IdiomDictTab1.js
// 连接数据库
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    theme_id: "",
    son_theme: [],
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    isSearch:false,
    isLoading:true,
    theme_name:""
  },

  //子主题卡片点击监听函数
  goToIdiomList:function(e){
    // 获取跳转至详情页的成语名
    var idiomConName = e.currentTarget.dataset.name
    // wx.showToast({
    //   title: '子主题'+idiomConName
    // })
  },
  // 获取搜索文本框内容
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail
    })
  },
  onCancel:function(e){
    this.setData({
      isSearch:false
    }) 
  },
  // 搜索文本框内容
  goToSearch:function(e){
    //搜索
    //在子标题基础上查找 ,主题已经确定
    const $ = db.command.aggregate
    var that = this
    var sonthemes=[]
    var wordIds=[]
    var key=this.data.inputValue

    if(key==null || key.length==0){
      this.setData({
        isSearch:false
      })
      return;
    }
    this.setData({
      isLoading:true
    })
    db.collection('son_theme_tb')
    .aggregate()
    .match({
      'son_theme_name': {
        $regex: '.*' + key + '.*', //.*等同于SQL中的%
        $options: 'i' //$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      },
      'theme_id':that.data.theme_id
    }).end({
      success: res => {
        var li = res.list
        for(var i=0;i<li.length;i++)
          sonthemes.push(li[i].son_theme_id);
        // console.log("子主题")
        // console.log(sonthemes)
        db.collection('word_theme_tb')
        .aggregate()
        .match($.and([
          {
            son_theme_id:$.in(sonthemes)
          } 
        ]))
        .limit(10000)
        .end({
          success: res => {
            var li = res.list
            for(var i=0;i<li.length;i++)
              wordIds.push(li[i].w_id);

            //单词表
            db.collection('word_tb')
              .aggregate()
              .match(
               $.or([
                 {
                   wid: $.in(wordIds)
                 },
                 $.and([{
                  'wname': {
                    $regex: '.*' + key + '.*', //.*等同于SQL中的%
                    $options: 'i' //$options:'1' 代表这个like的条件不区分大小写,详见开发文档
                  },
                  w_type:'0'
                 }])
               ]))
               .limit(10000)
               .end({
                success: res => {
                  //插入到sonTTheme内部
                  // console.log("每个单词") 
                  // console.log(res) 
                  that.setData({
                    InternetNewWork: res.list,
                    isSearch:true,
                    isLoading:false
                  })
              }})
          
          }})
          
      }})

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
      theme_name:options.theme_name
    })
    db.collection('son_theme_tb').aggregate()
    .match({
      theme_id: that.data.theme_id
    }).end().then( res => {  
        // console.log(res)
        that.setData({
          // theme : res.list
          son_theme: res.list,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})