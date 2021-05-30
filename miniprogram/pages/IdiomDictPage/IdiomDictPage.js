// 连接数据库
const db = wx.cloud.database();
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
    data: {
      navbar: ['传统成语', '网络新词'],
      current_1_title: '',
      currentTab: 0,
      InternetNewWork: [],  //网络成语list
      theme:[],       //传统成语分类数据
      inputValue: '',
      imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
      isSearch:false,
      isTotalNet:false,
      isLoading:true
    },
    getTotalNet:function(){
      var that = this
      this.setData({
        isLoading:true
      })
      db.collection('word_tb').aggregate()
      .match({
        w_type:"1"
      }).limit(10000).end().then( res => {  
          console.log(res)
          that.setData({
            // theme : res.list
            InternetNewWork: res.list,
            isTotalNet:true,
            isLoading:false
          })
      })
    },
    getRandomNet:function(){
      var that = this
      this.setData({
        isLoading:true
      })
      db.collection('word_tb').aggregate()
      .match({
        w_type:"1"
      }).sample({
        size: 4
      }).end().then( res => {  
          // console.log(res)
          that.setData({
            // theme : res.list
            InternetNewWork: res.list,
            isTotalNet:false,
            isLoading:false
          })
      })
    },
    // 子标签内切换
    navbarTap: function(e){
      // console.log(e)
      var index  = e.currentTarget.dataset.idx
      // wx.showToast({
      //   title: '页面切换到'+index,
      // })
      this.setData({
        currentTab: index,
        isSearch:false,
        inputValue:"",
        isTotalNet:false,
        isLoading:true
      }) 
      if(index==0){
        this.initTab1()
      }else{
        this.initTab2()
      }
    },
    goToIdiomCon:function(e){
      // 获取跳转至详情页的成语名
      var idiomConName = e.currentTarget.dataset.name
      // console.log(res)
      // wx.showToast({
      //   title: '主题'+idiomConName
      // })
    },

    // 获取搜索文本框内容
    bindKeyInput: function (e) {
      
      this.setData({
        inputValue: e.detail
      })
    },
    onCancel:function(e){
        var tabIndex = this.data.currentTab
        if(this.data.isSearch==false){
          return ;
        }
        this.setData({
          isSearch:false,
          isLoading:true
        })
        //恢复传统成语搜索
        if(tabIndex==0){
          this.initTab1();
          return ;
        }else{
          //网络词语搜索恢复
          this.initTab2();
        } 
    },
    // 搜索文本框内容
    goToSearch:function(e){
      // console.log(this.data.inputValue)
      // wx.showToast({
      //   title: '输入'+this.data.inputValue,
      // })
      var that = this
      var key = this.data.inputValue
      var tabIndex = this.data.currentTab
      if((key==null || key=="" ||key.length==0 )){
        this.setData({
          isSearch:false,
          isTotalNet:false,
          isLoading:true
        })
        //恢复传统成语搜索
        if(tabIndex==0){
          this.initTab1();
          return ;
        }else{
          //网络词语搜索恢复
          this.initTab2();
        }
        return ;
      }
      this.setData({
        isLoading:true
      })
      const $ = db.command.aggregate
      if(tabIndex==1){
        db.collection('word_tb')
				.aggregate()
				.match({
					'wname': {
						$regex: '.*' + key + '.*', //.*等同于SQL中的%
						$options: 'i' //$options:'1' 代表这个like的条件不区分大小写,详见开发文档
          },
          'w_type':''+this.data.currentTab
        })
        .limit(10000)
				.end({success: res => {
          //网络词汇没有分类，直接查询
          this.setData({
            InternetNewWork: res.list,
            isSearch:true,
            isTotalNet:false,
            isLoading:false
          })
        }})
        return ;
      }


      //如果查询的是成语则表示 -- 主题 --- 子主题 --- 成语名称
      //先模糊查询 -- 主题  ---- 子主题 ---- 成语名称
      //用map存储，如果
      
      //查询相应类型的数据
      var themes = []
      var sonthemes = []
      var wordIds = []
			db.collection('theme')
				.aggregate()
				.match({
					'theme_name': {
						$regex: '.*' + key + '.*', //.*等同于SQL中的%
						$options: 'i' //$options:'1' 代表这个like的条件不区分大小写,详见开发文档
          }
				})
				.end({
					success: res => {
              //查到了成语匹配度高的，再查子主题是否有包含的部分
              //获取主题部分 --->子主题  --->成语
              var li = res.list
              for(var i=0;i<li.length;i++)
                themes.push(li[i].theme_id);
              // console.log("主题")  
              // console.log(li)
              
              db.collection('son_theme_tb')
              .aggregate()
              .match({
                'son_theme_name': {
                  $regex: '.*' + key + '.*', //.*等同于SQL中的%
                  $options: 'i' //$options:'1' 代表这个like的条件不区分大小写,详见开发文档
                },
              }).end({
                success: res => {
                  var li = res.list
                  for(var i=0;i<li.length;i++)
                    sonthemes.push(li[i].son_theme_id);
                  
                //  console.log("子主题")
                //  console.log(sonthemes)
                 db.collection('word_theme_tb')
                 .aggregate()
                 .match(
                  $.or([
                    {
                      son_theme_id: $.in(sonthemes)
                    },{
                      theme_id: $.in(themes)
                    }
                  ]))
                  .limit(10000)
                  .end({
                   success: res => {
                     //插入到sonTTheme内部
                    //  console.log("单词") 
                    //  console.log(res) 
                     
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
                          w_type:''+this.data.currentTab
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

					}
				}) 
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 初始化加载：获取主题数据
      this.setData({
        isLoading:true
      })
      this.initTab1()
      this.initTab2()
  },

  initTab1:function(){
      // 查询传统成语分类
      var that = this

      db.collection('theme').aggregate()
      .match({
      }).end().then( res => {  
          // console.log(res)
          that.setData({
            theme : res.list,
            isLoading:false
          })
      })
  },
  initTab2:function(){
    // 查询网络新词
    var that = this
    db.collection('word_tb').aggregate()
    .match({
      w_type:"1"
    }).sample({
      size: 4
    }).end().then( res => {  
        // console.log(res)
        that.setData({
          // theme : res.list
          InternetNewWork: res.list,
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