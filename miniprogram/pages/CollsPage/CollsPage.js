// pages/CollsPage/CollsPage.js
var db = wx.cloud.database();
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    colls:[],
    isSearch:false,
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  return_func:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  onCancel:function(){

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
       console.log(res.result.list)
       that.setData({
        colls:res.result.list
       })
      }
    })
  },
  onLoad: function (options) {
    //查询收藏的物品
    
    this.onCancel()
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
    // console.log(e.detail)
  },
  onSearch() {
    var that = this
    console.log('搜索' + this.data.value);
    var key = this.data.value
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
       console.log(res)
       var ans = []
       var list = res.result.list
       for(var i=0;i<list.length;i++){
         if(list[i].item.length>0){
            var item = list[i].item[0]
            // console.log(item)
            if(item.uid == App.globalData._openid){
              ans.push(list[i])
              // console.log(list[i].w_cn_interpre)
            }
         }
       }
       that.setData({
        colls:ans,
        isSearch:true
       })
      }
    })
  

    // db.collection("fav_tb").where({	 	//collectionName 表示欲模糊查询数据所在collection的名
    //   // wname: db.RegExp({
    //   //   regexp:'.*爱.*',
    //   //   options: 'i',
    //   // })
    //   uid:App.globalData._openid
    // }).get({
    //   success:function(res){
    //     //结果
    //     var list = res.data
        
    //     console.log(res.data)
    //     db.collection('fav_tb').where({
    //       wid:_.in(list)
    //     }).orderBy('add_time','desc').get({
    //       success:function(res){
    //         console.log(res)
    //       }
    //     })
    //   }
    // }) 

  }
})