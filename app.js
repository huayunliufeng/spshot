const { getRequest } = require("./config")

// app.js
App({
  
  /**
   * 生命周期回调——监听小程序初始化。
   */
  onLaunch(options) {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        getRequest("/user/user/getOpenId/"+res.code).then((resp)=>{
          if(resp.data.flag){
            wx.setStorageSync('openid', resp.data.data);
          }else{
            wx.showToast({
              title: '获取openid失败！请检查网络',
              icon: 'error',
              duration: 2000
            });
          }
            
        },(err)=>{});
      }
    })
  },

  /**
   * 生命周期回调——监听小程序启动或切前台。
   */
  onShow(options){

  },

  /**
   * 生命周期回调——监听小程序切后台。
   */
  onHide(){

  },

  /**
   * 错误监听函数。
   */
  onError(msg){
    console.log(msg)
  }

})
