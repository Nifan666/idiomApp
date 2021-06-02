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
      isLoading:true,
      scrollViewHeight: 0,
      windowHeight: 0,
      imgNum:0
    },
    imageLoad:function(){
      this.data.imgNum++
      console.log("this.data.imgNum："+this.data.imgNum)
      console.log("this.data.InternetNewWork.length"+this.data.InternetNewWork.length)
      
      if(this.data.currentTab==0 && !this.data.isSearch){
        console.log("传统成语点击加载完成")
        if(this.data.imgNum>=this.data.theme.length){
          this.setData({
            isLoading:false,
            imgNum:0
          })
        } 
      }
      else if(this.data.currentTab==0 && this.data.isSearch){
        console.log("传统成语点击搜索完成")
        if(this.data.imgNum>=this.data.InternetNewWork.length){
          this.setData({
            isLoading:false,
            imgNum:0
          })
        }
      }

      else if(this.data.currentTab==1 && !this.data.isSearch){
        console.log("网络新词点击加载完成")
        if(this.data.imgNum>=this.data.InternetNewWork.length){
          this.setData({
            isLoading:false,
            imgNum:0
          })
        }
      }

      else if(this.data.currentTab==1 && this.data.isSearch){
        if(this.data.imgNum>=this.data.InternetNewWork.length){
          this.setData({
            isLoading:false,
            imgNum:0
          })
        }
      }
      
    },
     // 搜索文本框内容
     goToSearch:function(e){
      var that = this
      var key = this.data.inputValue
      var tabIndex = this.data.currentTab
      if((key==null || key=="" ||key.length==0 )){
        this.setData({
          isSearch:false,
          isTotalNet:false
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
          if(res.list.length==0){
            that.setData({
              isLoading:false
            })
          }
          // console.log("查询结果")
          console.log(res)
          //网络词汇没有分类，直接查询
          this.setData({
            InternetNewWork: res.list,
            isSearch:true,
            isTotalNet:false 
          })
        }})
        return ;
      }


      //如果查询的是成语则表示 -- 主题 --- 子主题 --- 成语名称
      //先模糊查询 -- 主题  ---- 子主题 ---- 成语名称
      //用map存储，如果
      this.setData({
        isLoading:true
      })
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
                          if(res.list.length==0){
                            that.setData({
                              isLoading:false
                            })
                          }
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
    getTotalNet:function(){
      var that = this
      this.setData({
        isLoading:true,
        InternetNewWork:[]
      })
      db.collection('word_tb').aggregate()
      .match({
        w_type:"1"
      }).limit(10000).end().then( res => {  
          
          that.setData({
            // theme : res.list
            InternetNewWork: res.list,
            isTotalNet:true 
          })
      })
    },
    getRandomNet:function(){
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
            isTotalNet:false 
          })
      })
    },
    // 子标签内切换
    navbarTap: function(e){
    
      var index  = e.currentTarget.dataset.idx

      if(this.data.currentTab==index && !this.data.isSearch){
        this.setData({
          isLoading:false
        })
        return ;
      }

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
   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 初始化加载：获取主题数据
      this.setData({
        isLoading:true
      })
      this.initLeftScorllViewHeight()
      this.initTab1()
      // this.initTab2()
  },
  
  initLeftScorllViewHeight:function(){
    var that = this
    wx.getSystemInfo({
      success: function(res) {
          that.setData({
              windowHeight: res.windowHeight
          });
      }
    });


    // 然后取出navbar和header的高度
        // 根据文档，先创建一个SelectorQuery对象实例
        let query = wx.createSelectorQuery().in(this);
        // 然后逐个取出navbar和header的节点信息
        // 选择器的语法与jQuery语法相同
        query.select('.center').boundingClientRect();
        query.select('.phone-bar').boundingClientRect();
        query.select('.navbar').boundingClientRect();
        query.select('.search-box').boundingClientRect();
        
        // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
        query.exec((res) => {
            // 分别取出navbar和header的高度
            let centerHeight = res[0].height;
            let phoneHeight = res[1].height;
            let navbarHeight = res[2].height;
            let searchHeight = res[3].height;

            // 然后就是做个减法
            let scrollViewHeight = this.data.windowHeight - centerHeight-phoneHeight-navbarHeight-searchHeight;
 
            // 算出来之后存到data对象里面
            that.setData({
                scrollViewHeight: scrollViewHeight
            });
        });
  },
  
  initTab1:function(){
      // 查询传统成语分类
      var that = this
      db.collection('theme').aggregate()
      .match({
      }).end().then( res => {  
          // console.log(res)
          that.setData({
            theme : res.list 
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
          InternetNewWork: res.list 
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