const {
  postRequest,
  getRequest
} = require("../../../config");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    quesList: [{
      question: '',
      optional: '',
      item: [{
        key: '选项1',
        ans: ''
      }]
    }],
    title: '',
    isanony: false,
    ispublic: true,
    partpass: '',
    effecttime: '5',
    maxperson: '-1',
    slideButtons: [{
      type: 'warn',
      text: '删除',
      extClass: 'test'
    }],
    dataVal1: true,
    dataVal2: true,
    dataVal3: true,
    buttons: [{
      text: '确认'
    }],
    dialog2: false,
    dialog3: false,
    buttons2: [{
        text: '取消'
      },
      {
        text: '确认'
      }
    ],
  },

  // 是否匿名
  isanony(e) {
    this.setData({
      isanony: e.detail.value
    })
  },

  // 是否公开
  ispublic(e) {
    this.setData({
      ispublic: e.detail.value
    })
  },
  //参与密码
  formInputChangePass(e) {
    if (e.detail.value != '') {
      let exp = /\w{4}/;
      if (!exp.test(e.detail.value)) {
        this.setData({
          showTopTips: true,
          message: '格式错误，四位字母或数字',
          type: 'error',
          dataVal1: false
        });
        return;
      }
      this.setData({
        partpass: e.detail.value,
        dataVal1: true
      })
    }
  },
  //有效时间
  formInputChangeTime(e) {
    let exp = /^[1-9]\d*$/;
    if (e.detail.value >= 1 && e.detail.value <= 72 && exp.test(e.detail.value)) {
      this.setData({
        effecttime: e.detail.value,
        dataVal2: true
      })
    } else {
      this.setData({
        showTopTips: true,
        message: '应为1-72之间的正整数',
        type: 'error',
        dataVal2: false
      });
      return;
    }
  },
  //最大参与人数
  formInputChangeMax(e) {
    let exp = /^[1-9]*[-]*\d*/;
    if (!exp.test(e.detail.value) || e.detail.value == 0 || e.detail.value < -1) {
      this.setData({
        showTopTips: true,
        message: '只能是-1或者大于0的数',
        type: 'error',
        dataVal3: false
      });
      return;
    } else {
      this.setData({
        maxperson: e.detail.value,
        dataVal3: true
      })
    }
  },

  // 删除问题
  slideButtonTap(e) {
    let index = e.currentTarget.dataset.index;
    let old = this.data.quesList;
    if (old.length <= 1) {
      return;
    }
    old.splice(index, 1);
    this.setData({
      quesList: old
    })
  },

  // 删除选项
  slideButtonTapAns(e) {
    let index = e.currentTarget.dataset.index;
    let ind = e.currentTarget.dataset.ind;
    let old = this.data.quesList;
    if (old[index].item[ind].ans == '') {
      return;
    }
    old[index].item.splice(ind, 1);
    let length = old[index].item.length;
    if (length < 1) {
      this.setData({
        showTopTips: true,
        message: '最少一个选项',
        type: 'error'
      });
      return;
    }
    old[index].item[length - 1].key = '选项' + (length);
    this.setData({
      quesList: old
    })
  },

  // 标题
  title(e) {
    if (e.detail.value == '') {
      this.setData({
        showTopTips: true,
        message: '标题不能为空',
        type: 'error'
      });
      return;
    };
    this.setData({
      title: e.detail.value
    })
  },

  // 问题
  question(e) {
    if (e.detail.value == '') {
      this.setData({
        showTopTips: true,
        message: '问题不能为空',
        type: 'error'
      });
      return;
    };
    let index = e.currentTarget.dataset.index;
    this.data.quesList[index].question = e.detail.value;
  },

  // 添加选项
  nextAns(e) {
    if (e.detail.value === '') {
      return;
    }
    let index = e.currentTarget.dataset.index;
    let ind = e.currentTarget.dataset.ind;
    let old = this.data.quesList;
    if (ind <= old[index].item.length - 2) {
      return;
    }
    for (let i = 0; i < old[index].item.length; i++) {
      if (e.detail.value == old[index].item[i].ans && ind !== i) {
        this.setData({
          showTopTips: true,
          message: '选项不可重复',
          type: 'error'
        });
        return;
      }
    }
    let tmp = {
      question: this.data.quesList[index].question,
      item: this.data.quesList[index].item
    }
    tmp.item[ind].ans = e.detail.value;
    tmp.item[ind + 1] = {};
    tmp.item[ind + 1].key = '选项' + (ind + 2);
    tmp.item[ind + 1].ans = '';
    old[index] = tmp;
    this.setData({
      quesList: old
    })
  },

  //添加问题
  nextQues(e) {
    let old = this.data.quesList;
    let tmp = {
      question: '',
      optional: '',
      item: [{
        key: '选项1',
        ans: ''
      }]
    };
    this.setData({
      quesList: old.concat(tmp)
    })
  },

  //确认
  tapDialogButton2(e) {
    if (e.detail.item.text == '确认') {
      // 获取订阅状态
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          let m1 = res.subscriptionsSetting.itemSettings;
          let tmp = {
            'SZ2rQZAMh71-ThVzMrF4sNOyuCQf1lT25OqedMkG5Uo': 'accept',
            'SCQETrzvapNpu9E79twJf12Vfd_wv71CvRQJUpFlCtg': 'accept',
            'dnTs-eIUffDVy9wH9GS-hYVCJcP1F4JJcZ3_7a2UR8g': 'accept'

          };
          console.log(m1)
          if (m1 != tmp) {
            // 订阅消息授权
            wx.requestSubscribeMessage({
              tmplIds: ['SZ2rQZAMh71-ThVzMrF4sNOyuCQf1lT25OqedMkG5Uo', 'SCQETrzvapNpu9E79twJf12Vfd_wv71CvRQJUpFlCtg', 'dnTs-eIUffDVy9wH9GS-hYVCJcP1F4JJcZ3_7a2UR8g'],
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
      //隐藏确认框
      this.setData({
        dialog2: false
      });
      //显示加载框
      wx.showToast({
        title: 'loading',
        icon: 'loading',
        duration: 5000
      });

      // 获取用户id和用户名
      var id;
      var username;
      try {
        id = wx.getStorageSync('userInfo').id
        username = wx.getStorageSync('userInfo').username;
      } catch (e) {
        // Do something when catch error
        console.log(e)
      }
      let issure = {
        userid: id,
        username: username,
        title: this.data.title,
        effecttime: this.data.effecttime,
        maxperson: this.data.maxperson,
        partpass: this.data.partpass,
        ispublic: this.data.ispublic ? '1' : '0',
        isanony: this.data.isanony ? '1' : '0',
        items: this.data.quesList
      };
      postRequest("/issure/issure", issure).then((res) => {
        if (res.data.flag) {
          wx.showToast({
            title: '等待审核',
            duration: 3000,
          })
          this.setData({
            quesList: [{
              question: '',
              optional: '',
              item: [{
                key: '选项1',
                ans: ''
              }]
            }],
            title: '',
            isanony: false,
            ispublic: true,
            partpass: '',
            effecttime: '5',
            maxperson: '-1',
            slideButtons: [{
              type: 'warn',
              text: '删除',
              extClass: 'test'
            }],
            dataVal1: true,
            dataVal2: true,
            dataVal3: true
          });
          //更新用户信息
          getRequest("/user/user/" + id).then((res) => {
            if (res.data.flag) {
              wx.setStorageSync('userInfo', res.data.data);
            } else {
              this.setData({
                showTopTips: true,
                message: '更新本地用户信息失败！',
                type: 'error'
              });
            }
          }, (err) => {
            this.setData({
              showTopTips: true,
              message: '请检查网络',
              type: 'error'
            });
          });
        } else {
          wx.showToast({
            icon: 'error',
            title: '请重试'
          });
        }
      }, (err) => {

      });
    } else {
      this.setData({
        dialog2: false
      })
    }

  },

  tapDialogButton3(){
    this.setData({
      dialog3: false
    })
  },


  //提交
  submit() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo === null || userInfo === '') {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    if (userInfo.todaynum <= 0) {
      this.setData({
        dialog3: true,
        text: '您今日发布次数已用尽'
      });
      return;
    }
    // 判断是否有发布权限
    if (userInfo.state === -1 || userInfo.state === 2) {
      this.setData({
        dialog3: true,
        text: '您暂时不可发布投票'
      });
      return;
    }

    //额外选项格式
    if (!this.data.dataVal1 || !this.data.dataVal2 || !this.data.dataVal3 || this.data.title == '') {
      this.setData({
        showTopTips: true,
        message: '请检查表单，填写有误！',
        type: 'error'
      });
      return;
    }

    //检查其它
    let tmp = this.data.quesList;
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].question == '' || tmp[i].optional == '' || (tmp[i].optional > tmp[i].item.length - 1) || tmp[i].optional === undefined || tmp[i].optional === '') {
        this.setData({
          showTopTips: true,
          message: '请检查表单，填写有误！',
          type: 'error'
        });
        return;
      }
      for (let j = 0; j < tmp[i].item.length - 1; j++) {
        if (tmp[i].item[j].ans == '') {
          this.setData({
            showTopTips: true,
            message: '请检查表单，填写有误！',
            type: 'error'
          });
          return;
        }
      }
    }
    //检查无误，弹出确认框
    this.setData({
      dialog2: true
    });

  },

  // 最大可选
  optional(e) {
    let index = e.currentTarget.dataset.index;
    let max = this.data.quesList[index].item.length - 1;
    let old = this.data.quesList;
    let exp = /^[1-9]\d*$/;
    if (!exp.test(e.detail.value) || e.detail.value > max) {
      this.setData({
        showTopTips: true,
        message: '格式错误（范围1-' + max + '）',
        type: 'error'
      });
      return;
    }
    old[index].optional = e.detail.value
    this.setData({
      quesList: old
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  // 页面切换事件
  onTabItemTap(item) {
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
    return {
      title: '快来参与投票吧！',
      path: '/pages/component/hall/hall',
      imageUrl: 'http://hylf.club:8090/images/share.jpeg'
    }
  }
})