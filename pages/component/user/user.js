import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from "../../../config.js"
Page({
  data: {
    show: false,
    type: 't2_1_1',
    msgNum: 0,
    isLogin: false
  },

  onLoad() {

  },

  //页面显示事件
  onShow() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo === '' || userInfo === null) {
      this.setData({
        isLogin: false
      })
    } else {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      })
      if (userInfo.state == 0) {
        this.setData({
          type: 't2_1_1'
        });
      } else if (userInfo.state == 1) {
        this.setData({
          type: 't2_1_2'
        });
      } else if (userInfo.state == 2) {
        this.setData({
          type: 't2_1_3'
        });
      } else {
        this.setData({
          type: 't2_1_4'
        });
      }

      //获取消息数
      getRequest("/data/feedback/deal/" + userInfo.id).then((res) => {
        if (res.data.flag) {
          if (res.data.data) {
            this.setData({
              msgNum: res.data.data,
              show: true
            })
          } else {
            this.setData({
              show: false
            })
          }

        }
      }, (err) => {});
    }
  },

  //我参与的 
  part() {
    if(!this.data.isLogin){
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
    wx.navigateTo({
      url: './part/part'
    })
  },

  // 我发布的
  issure() {
    if(!this.data.isLogin){
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
    wx.navigateTo({
      url: './issure/issure'
    })
  },

  // 系统消息
  sysMessage() {
    if(!this.data.isLogin){
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
    wx.navigateTo({
      url: './sysMessage/sysMessage'
    })
  },

  // 用户反馈
  feedback() {
    wx.navigateTo({
      url: './feedback/feedback'
    })
  },

  // 使用说明
  help() {
    wx.navigateTo({
      url: './help/help',
    })
  }





})