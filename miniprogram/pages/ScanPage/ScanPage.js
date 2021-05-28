// pages/ScanPage/ScanPage.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956",
    baiduToken:"",
    isScan:false,
    colls:[],
    isLoadedScan:false,
  },
  onClick:function(){
    //获取拍照权限

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getBaiduToken()
  },
  reScan:function(){
    this.setData({
      isScan:false
    })
  },
  imageLoad:function(){
    this.setData({
      isLoadedScan:true
    })
  },
  getBaiduToken: function(){
    var apiKey = 'n6u9VNII79wYu2QMIhid725A';    
    var secKey = 'A8lzhLXp5Y3V7btdcEVfd7QsNhMppMj5';    
    var tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+apiKey+'&client_secret='+secKey;    
    var that = this;    
    wx.request({        
        url: tokenUrl,        
        method: 'GET',        
        dataType: 'json',        
        header:{           
            "Content-Type": "json"  
        },    
        success: function(res){            
            console.log("[BaiduToken获取成功]",res);            
            that.setData({                
                baiduToken: res.data.access_token                            })        
        },        
        fail: function(res){            
            console.log("[BaiduToken获取失败]",res);
        }    
    })  
  }, 
  scanImageInfo: function(imageData){    // 这里的imageData是图片转换成base64格式的数据
    console.log("scanImageInfo")
    var that = this;
    const $ = db.command.aggregate
    const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${that.data.baiduToken}`    // baiduToken是已经获取的access_Token
    console.log('123',detectUrl) 
      return new Promise(function(resolve,reject){        
        wx.request({            
            url: detectUrl,            
            data: {                
                image: imageData            
            },            
            method: 'POST',            
            dataType: 'json',            
            header:{                
                'content-type': 'application/x-www-form-urlencoded'    // 必须的        
            },            
            success: function(res, resolve){              
                console.log('get word success：',res.data);
                var lis = res.data.words_result
                var words = []
                for(var i=0;i<lis.length;i++){
                  console.log(lis[i].words) 
                  words.push(lis[i].words)
                } 
                //开始在数据库中匹配   
                db.collection('word_tb')
                 .aggregate()
                 .match(
                  $.or([
                    {
                      wname: $.in(words)
                    } 
                  ])).end({
                   success: res => {
                      console.log(res)
                      that.setData({
                        isScan:true,
                        colls:res.list,
                        isLoadedScan:false
                      })
                   }})
            },            
            fail : function(res,reject){              
                console.log('get word fail：',res.data);                       
              },            
        })
    }) 
  },
  doUpload: function () {
    var that = this    
    that.getBaiduToken()    // 提前获取access_Token
    // 选择图片，拍照或从相册中获取
    wx.chooseImage({      
        count: 1,      
        sizeType: ['compressed'],      
        sourceType: ['album', 'camera'],      
        success: function (res) {
            wx.showLoading({          
                title: '上传中',        
            })
                const filePath = res.tempFilePaths[0]                
                // 上传图片 
                
                wx.getFileSystemManager().readFile({          
                    filePath: filePath,          
                    encoding: 'base64',          
                    success: function(res) {            
                        console.log("[读取图片数据success]",res.data);            
                        that.scanImageInfo(res.data);    // 调用百度API解析图片获取文字      
                    },            
                    fail: function(res){            
                        console.log("[读取图片数据fail]",res)          
                    },            
                    complete: function(res){            
                        wx.hideLoading()          
                    }    
            })
        }    
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