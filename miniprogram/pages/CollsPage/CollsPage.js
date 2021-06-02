// pages/CollsPage/CollsPage.js
var db = wx.cloud.database();
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    value: '',
    colls:[],
    isSearch:false,
    isLoading:true,
    imgNum:0,
    scrollViewHeight: 0,
    windowHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  return_func:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  onShow:function(){
    this.setData({
      value: '',
      colls:[],
      isSearch:false,
      isLoading:true,
      imgNum:0
    })
    this.loadDate()
  },
  loadDate:function(){
    var that = this
    wx.cloud.callFunction({
      name:'con2tb',
      data:{
        collection:'fav_tb',
        from:'word_tb',
        localField:'wid',
        foreignField:'wid',
        as:'item',
        match:{
          uid:App.globalData._openid
        },
        sort:{
          add_time: -1
        }
      },
      success:res=>{
        if(res.result.list.length==0){
          that.setData({
            colls:res.result.list,
            isSearch:false,
            isLoading:false
          })
        }else{
          that.setData({
            colls:res.result.list,
            isSearch:false
           })
        }
      }
    })
  },

  imageLoad:function(){
    this.data.imgNum++
    // console.log(this.data.imgNum)
   
    if(this.data.imgNum >= this.data.colls.length*2){
      // console.log("图片总个数:"+this.data.colls.length*2)
      this.setData({
        isLoading:false
      })
    }
  },
  onCancel:function(e){
    if(this.data.isSearch==false){
      this.setData({
        isLoading:false
      })
      return ;
    }
    this.setData({
      isLoading:true
    })
    var that = this
    wx.cloud.callFunction({
      name:'con2tb',
      data:{
        collection:'fav_tb',
        from:'word_tb',
        localField:'wid',
        foreignField:'wid',
        as:'item',
        match:{
          uid:App.globalData._openid
        },
        sort:{
          add_time: -1
        }
      },
      success:res=>{
        // console.log(res)
        if(res.result.list.length==0){
          that.setData({
            colls:[],
            isSearch:false,
            isLoading:false
          })
          return ;
        }
       that.setData({
        colls:res.result.list,
        isSearch:false 
       })
      }
    })
  },
  onLoad: function (options) {
    //查询收藏的物品
    this.loadDate()
    this.initLeftScorllViewHeight()
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
        query.select('.back-line').boundingClientRect();
        query.select('.phone-bar').boundingClientRect();
        query.select('#search').boundingClientRect(); 
        
        // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
        query.exec((res) => {
            // 分别取出navbar和header的高度
            let backHeight = res[0].height;
            let phoneHeight = res[1].height;
            let searchHeight = res[2].height; 

            // 然后就是做个减法
            let scrollViewHeight = this.data.windowHeight - backHeight-phoneHeight-searchHeight;
 
            // 算出来之后存到data对象里面
            that.setData({
                scrollViewHeight: scrollViewHeight
            });
        });
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
    // console.log(e.detail)
  },
  onSearch() {
    this.setData({
      isLoading:true,
      colls:[]
    })
    var that = this
    
    var key = this.data.value
    if(key=="" || key==null || key.length==0){
      // console.log('搜索' + this.data.value);
      this.onCancel()
      return ;
    }
    //先查找一波
    wx.cloud.callFunction({
      name:'con2tb',
      data:{
        collection:'word_tb',
        from:'fav_tb',
        localField:'wid',
        foreignField:'wid',
        as:'item',
        match:{
          wname: db.RegExp({
              regexp:'.*'+key+'.*',
              options: 'i',
          }),
        },
        sort:{
          add_time: -1
        }
      },
      success:res=>{ 
       var ans = []
       var list = res.result.list
       for(var i=0;i<list.length;i++){
         if(list[i].item.length>0){
            var item = list[i].item[0] 
            if(item.uid == App.globalData._openid){
              ans.push(list[i]) 
            }
         }
       } 
      //  console.log(ans)
       if(ans.length==0){
         that.setData({
          colls:[],
          isSearch:true,
          isLoading:false
         })
         return ;
       }
       that.setData({
        colls:ans,
        isSearch:true,
       })

      }
    })
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