import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from "../../../config.js";
import {
  dateformat
} from "../../../utils/util.js"
Page({
  mixins: [require('../../mixin/common.js')],
  data: {
    //图片列表
    openid: '',
    images: [],
    //自动播放
    autoplay: true,
    //循环时间
    interval: 2000,
    //持续时间
    duration: 500,
    //分页相关属性
    pagination: {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      queryString: ''
    },
    //列表值
    tableData: [],
    //正在加载
    showLoding: true,
    //暂无数据
    showMax: false,
  },

  // 复制链接
  copy(e) {
    let index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data: this.data.images[index].url,
      success: () => {
        wx.hideToast({
          success: (res) => {},
        });
        this.setData({
          showTopTips: true,
          message: '复制链接成功，请到浏览器中打开',
          type: 'success'
        });
        return;
      }
    })
  },

  //页面加载事件
  onLoad() {
    // this.initTableData();
  },

  //页面渲染完成事件
  onReady(){
    this.initTableData();
  },

  //初始化数据
  initTableData() {
    //登录
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    if (userInfo !== null && userInfo !== '') {
      //更新用户信息
      let user = {
        openid: wx.getStorageSync('openid')
      }
      postRequest("/user/user/login", user).then((res) => {
        if (res.data.flag) {
          this.setData({
            userInfo: res.data.data
          });
          wx.setStorageSync('userInfo', res.data.data);
        } else {
          this.setData({
            showTopTips: true,
            message: res.data.message,
            type: 'error'
          });
        }
      }, (err) => {
        this.setData({
          showTopTips: true,
          message: '请检查网络！',
          type: 'error'
        });
      });
      //获取消息数
      getRequest("/data/feedback/deal/" + userInfo.id).then((res) => {
        if (res.data.flag) {
          if (res.data.data > 0) {
            wx.setTabBarBadge({
              index: 2,
              text: res.data.data + '',
            });
          } else {
            wx.removeTabBarBadge({
              index: 2,
            });
          }
        } else {
          this.setData({
            showTopTips: true,
            message: res.data.message,
            type: 'error'
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
    // 获取投票分页
    this.setData({
      pagination: { //分页相关属性
        currentPage: 1,
        pageSize: 10,
        total: 0,
        queryString: ''
      }
    });
    //投票分页
    postRequest("/issure/issure/search", this.data.pagination).then((res) => {
      if (res.data.flag) {
        if (res.data.data.rows.length < this.data.pagination.pageSize) {
          this.setData({
            showLoding: false,
            showMax: true
          })
        } else {
          this.setData({
            showLoding: true,
            showMax: false
          })
        }
        let oldPagin = this.data.pagination;
        oldPagin.total = res.data.data.total;
        let tmp = res.data.data.rows;
        for (let i = 0; i < tmp.length; i++) {
          tmp[i].accepttime = dateformat(tmp[i].accepttime);
          tmp[i].username = tmp[i].username.substring(0, 15)
        }
        this.setData({
          tableData: tmp,
          pagination: oldPagin
        });
      } else {
        this.setData({
          showTopTips: true,
          message: res.data.message,
          type: 'error'
        });
      }
    }, (err) => {
      this.setData({
        showTopTips: true,
        message: '请检查网络！',
        type: 'error'
      });
    });
    // 获取推广数据
    getRequest("/data/promote/getRecPromote").then((res) => {
      if (res.data.flag) {
        this.setData({
          images: res.data.data
        })
      } else {
        this.setData({
          showTopTips: true,
          message: res.data.message,
          type: 'error'
        });
      }
    }, (err) => {
      this.setData({
        showTopTips: true,
        message: '请检查网络！',
        type: 'error'
      });
    });

  },

  //下拉刷新
  onPullDownRefresh: function () {
    // Do something when pull down.
    wx.showNavigationBarLoading();
    this.initTableData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({
      showLoding: true,
      showMax: false,
    })

  },

  //上拉加载
  onReachBottom: function () {
    if (this.data.showMax) {
      return;
    }
    // Do something when page reach bottom.
    this.setData({
      showLoding: true,
      showMax: false,
      pagination: {
        currentPage: this.data.pagination.currentPage + 1,
        pageSize: 10,
        queryString: ''
      }
    });

    //投票分页
    postRequest("/issure/issure/search", this.data.pagination).then((res) => {
      if (res.data.flag) {
        //如果是没有更多
        if (res.data.data.rows.length < this.data.pagination.pageSize) {
          this.setData({
            showLoding: false,
            showMax: true
          });
        }
        // 续接数据
        let old = this.data.tableData;
        let oldPagin = this.data.pagination;
        oldPagin.total = res.data.data.total;
        let tmp = res.data.data.rows;
        for (let i = 0; i < tmp.length; i++) {
          tmp[i].accepttime = dateformat(tmp[i].accepttime);
          tmp[i].username = tmp[i].username.substring(0, 15)
        }
        this.setData({
          tableData: old.concat(tmp),
          pagination: oldPagin
        });

      } else {
        this.setData({
          showTopTips: true,
          message: res.data.message,
          type: 'error'
        });
      }
    }, (err) => {
      this.setData({
        showTopTips: true,
        message: '请检查网络！',
        type: 'error'
      });
    });

  },
  //搜索事件
  search(e) {
    this.setData({
      pagination: {
        currentPage: 1,
        pageSize: 10,
        queryString: e.detail.value
      }
    });
    // 发送请求
    postRequest("/issure/issure/search/isNotPublic", this.data.pagination).then((res) => {
      if (res.data.flag) {
        //如果是没有更多
        if (res.data.data.rows.length < this.data.pagination.pageSize) {
          this.setData({
            showLoding: false,
            showMax: true
          });
        }
        // 格式化时间
        let tmp = res.data.data.rows;
        let oldPagin = this.data.pagination;
        oldPagin.total = res.data.data.total;
        for (let i = 0; i < tmp.length; i++) {
          tmp[i].accepttime = dateformat(tmp[i].accepttime);
        }
        this.setData({
          tableData: tmp,
          pagination: oldPagin
        });
      } else {
        this.setData({
          showTopTips: true,
          message: res.data.message,
          type: 'error'
        });
      }
    }, (err) => {
      this.setData({
        showTopTips: true,
        message: '请检查网络！',
        type: 'error'
      });
    });


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快来参与投票吧！',
      path: '/pages/component/hall/hall',
      imageUrl: 'http://hylf.club:8090/images/share.jpeg'
    }
  }


})