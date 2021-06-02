const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconFlag: 'cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/HomePgae/icon-flag.png',
    bannerCurrent: 0, // 当前显示的banner
    bannerData:[],
    last_wpic:"cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/HomePgae/more.jpg",
    last_title:"点击查看更多",
    last_detail:"跳转至“群词荟萃”页面"
    // bannerData: [
    //   {'id': 1, 'wpic': 'cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/DynastiesClassification/174.jpg', 'img': '../../images/闻雷泣墓.jpg', 'title': '桃之夭夭', 'pinyin': 'táo zhī yāo yāo', 'isOpenFilp': false, 'w_cn_interpre': '桃之夭夭，灼灼其华。', 'w_eng_interpre': 'The peach is young and bright.', 'idiomType': '传统词汇', 'otherInfo':'Alita: Battle Angel' },
    //   {'id': 2, 'wpic': '../../images/HomePage/主页-山水墨色1.png', 'img': '../../images/闻雷泣墓.jpg', 'title': '夕阳西下', 'pinyin': 'xī yáng xī xià', 'isOpenFilp': false, 'w_cn_interpre': '夕阳西下，断肠人在天涯。', 'w_eng_interpre': 'Sunset, heartbroken people in the end of the world.', 'idiomType': '传统词汇', 'otherInfo': 'Dying to Survive'  },
    //   {'id': 3, 'wpic': '../../images/HomePage/主页-伊人4.png', 'img': '../../images/闻雷泣墓.jpg', 'title': '所谓伊人', 'pinyin': 'suǒ wèi yī rén', 'isOpenFilp': false, 'w_cn_interpre': '所谓伊人，在水一方。', 'w_eng_interpre': 'The one are on the water side', 'idiomType': '传统词汇',  'otherInfo': 'The Wind Guardians' },
    // ],
  },

  //随机获取5个每日推荐卡片数据
  getData(){
    db.collection("word_tb").aggregate().sample({
      size:5
    }).end().then(res=>{
      res.list.forEach(item => {
        // console.log(item.wpic)
        item.wpic="cloud://cloud1-8g8oiizf3797896b.636c-cloud1-8g8oiizf3797896b-1305728956/"+item.wpic
        if(item.w_type=='0'){
          item.word_type="传统成语"
        }else if(item.w_type=='1'){
          item.word_type="网络新词"
        }
        // console.log(item.wpic)
      });
      this.setData({
        bannerData:res.list
      })
    })
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  
  // bannerSwiper
  bannerSwiper(e) {

    var bannerData = this.data.bannerData
    for(var i = 0;i<5;i++){
      bannerData[i].isOpenFilp = false
    }
    
    const that = this, bannerCurrent = e.detail.current;
    that.setData({
      bannerCurrent:bannerCurrent,
      bannerData:bannerData
    })
  },

  // 卡牌切换
  switchFlip: function (e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    const bannerData = that.data.bannerData;
    var item = e.currentTarget.dataset.msg 

    if(that.data.bannerData[index].isOpenFilp==true){
      if(item.w_type=="0"){
        wx.navigateTo({
          url: '/pages/DictConClassical/DictConClassical?wid='+item.wid,
        })
      }else{
        wx.navigateTo({
          url: '/pages/DictConInternet/DictConInternet?wid='+item.wid,
        })
      }
    }else{
      const isOpenFilp = that.data.bannerData[index].isOpenFilp ? false : true;
      bannerData[index].isOpenFilp = isOpenFilp;
      that.setData({
        bannerData
      });
    }
    
  },

  // 跳转到群词荟萃
  toThemePage: function (e) {
    wx.switchTab({
      url: '/pages/IdiomDictPage/IdiomDictPage'
      // url: '/pages/IntroPage/IntroPage',
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
  }, 
})