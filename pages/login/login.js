// pages/login/login.js
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
  } from "../../config.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },


    //获取用户信息
    login(){
        let openid = wx.getStorageSync('openid');
        // 获取用户信息
      wx.getUserProfile({
        desc: '获取用户名和头像',
        success: (res) => {
          //存储信息到后台
          let user = {
            openid: openid,
            username: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          }
          postRequest("/user/user/login", user).then((res) => {
            if (res.data.flag) {
              // 存储信息到本地
              wx.setStorageSync('userInfo', res.data.data);
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1500
              });
              //返回页面
              wx.navigateBack();
            } else {
              this.setData({
                showTopTips: true,
                message: res.data.message,
                type: 'error',
                dialog: true
              });
            }
          }, (err) => {
            this.setData({
              showTopTips: true,
              message: '请检查网络！',
              type: 'error'
            });
          });
        }
      });
      // 获取订阅状态
      wx.getSetting({
        withSubscriptions: true,
        success: (res) => {
          let m1 = res.subscriptionsSetting.itemSettings;
          let tmp = {
            'SZ2rQZAMh71-ThVzMrF4sNOyuCQf1lT25OqedMkG5Uo': 'accept',
            'SCQETrzvapNpu9E79twJf6mbVhS7nrYVsVwMstw5P2E': 'accept',
            'dnTs-eIUffDVy9wH9GS-hYVCJcP1F4JJcZ3_7a2UR8g': 'accept'
          };
          console.log(m1);
          if (m1 != tmp) {
            // 订阅消息授权
            wx.requestSubscribeMessage({
              tmplIds: ['SZ2rQZAMh71-ThVzMrF4sNOyuCQf1lT25OqedMkG5Uo', 'SCQETrzvapNpu9E79twJf6mbVhS7nrYVsVwMstw5P2E', 'dnTs-eIUffDVy9wH9GS-hYVCJcP1F4JJcZ3_7a2UR8g'],
              success(res) {
                console.log(res);
              },
              fail(err) {
                console.log(err);
              }
            });
          }
        }
      });

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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