// pages/component/hall/desc.js
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
} from "../../../config.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        passDis: false,
        buttDis: false,
        inputPass: '',
        formData: {},
        choose: [],
        dialog: false,
        dialog3: false,
        dialog4: false,
        buttons: [{
                text: '取消'
            },
            {
                text: '确认'
            }
        ],
        buttons2: [{
            text: '确认'
        }]
    },

    //单选
    radioChange(e) {
        let index = e.target.dataset.index;
        let value = e.detail.value;
        let old = this.data.choose;
        let tmp = this.data.formData;
        for (let i = 0; i < tmp.items[index].item.length; i++) {
            if (value === tmp.items[index].item[i].ans) {
                tmp.items[index].item[i].checked = true;
            } else {
                tmp.items[index].item[i].checked = false;
            }
        }
        this.setData({
            formData: tmp
        })
        old[index] = [];
        old[index][0] = value;
        this.setData({
            choose: old
        })
    },
    //多选
    checkboxChange(e) {
        let index = e.target.dataset.index;
        let values = e.detail.value;
        let tmp = this.data.formData;
        for (let i = 0; i < tmp.items[index].item.length; i++) {
            tmp.items[index].item[i].checked = false;
            for (let j = 0; j < values.length; ++j) {
                if (values.length > tmp.items[index].optional) {
                    values.shift(values[0]);
                }
                if (tmp.items[index].item[i].ans === values[j]) {
                    tmp.items[index].item[i].checked = true;
                    break;
                }
            }
        }
        this.setData({
            formData: tmp
        });
        let old = this.data.choose;
        old[index] = values;
        this.setData({
            choose: old
        })

    },

    //确认
    tapDialogButton(e) {
        if (e.detail.item.text == '确认') {
            // 获取订阅状态
            wx.getSetting({
                withSubscriptions: true,
                success: (res) => {
                    let m1 = res.subscriptionsSetting.itemSettings;
                    let tmp = {
                        'SZ2rQZAMh71-ThVzMrF4sNOyuCQf1lT25OqedMkG5Uo': 'accept',
                        'SCQETrzvapNpu9E79twJf12Vfd_wv71CvRQJUpFlCtg': 'accept',
                        'dnTs-eIUffDVy9wH9GS-hYVCJcP1F4JJcZ3_7a2UR8g': 'accept'

                    };
                    console.log(m1);
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

                    // 提交请求
                    //隐藏确认框
                    this.setData({
                        dialog: false
                    });
                    //显示加载框
                    wx.showToast({
                        title: 'loading',
                        icon: 'loading',
                        duration: 5000
                    });

                    try {
                        var id = wx.getStorageSync('userInfo').id
                    } catch (e) {
                        // Do something when catch error
                        console.log(e)
                    }

                    let data = [];
                    let ch = this.data.choose;
                    let k = 0;
                    for (let i = 0; i < ch.length; i++) {
                        for (let j = 0; j < ch[i].length; j++) {
                            let it = {
                                userid: id,
                                itemsid: this.data.formData.items[i].id,
                                choose: ch[i][j]
                            }
                            data[k++] = it;
                        }
                    }
                    postRequest("/issure/issure/part/" + id + "/" + this.data.formData.id, data).then((res) => {
                        if (res.data.flag) {
                            this.setData({
                                showTopTips: true,
                                message: '提交成功！请留意投票结果',
                                type: 'success'
                            });
                            // 选择完毕，禁用投票
                            let tmp = this.data.formData;
                            for (let i = 0; i < tmp.items.length; i++) {
                                for (let j = 0; j < tmp.items[i].item.length; j++) {
                                    tmp.items[i].item[j].dis = true
                                }
                            }
                            this.setData({
                                formData: tmp,
                                buttDis: true
                            })
                            //更新用户信息
                            getRequest("/user/user/" + id).then((res) => {
                                if (res.data.flag) {
                                    wx.setStorageSync('userInfo', res.data.data);
                                } else {
                                    this.setData({
                                        showTopTips: true,
                                        message: '更新用户信息失败',
                                        type: 'error'
                                    });
                                }
                            }, (err) => {});
                            //隐藏
                            wx.hideToast()
                        } else {
                            this.setData({
                                showTopTips: true,
                                message: res.data.message,
                                type: 'error'
                            });
                        }

                    }, (err) => {});


                }
            });
        } else {
            this.setData({
                dialog: false
            });
        }
    },

    //提交
    submit(e) {
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo === null || userInfo === '') {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return;
        }
        // 账号是否被限制
        if (userInfo.state === -1 || userInfo.state === 1) {
            this.setData({
                dialog3: true
            });
            return;
        }
        //参与密码
        if (this.data.formData.partpass&&!this.data.passDis) {
            this.setData({
                dialog4: true
            });
            return;
        }
        let choose = this.data.choose;
        console.log(choose)
        for (let i = 0; i < this.data.formData.items.length; i++) {
            if (choose[i].length <= 0) {
                this.setData({
                    showTopTips: true,
                    message: '有选项为空！',
                    type: 'error'
                });
                return;
            }
        }
        this.setData({
            dialog: true
        });
    },

    // 不可参与
    tapDialogButton3() {
        wx.switchTab({
            url: '/pages/component/hall/hall',
        });
    },

    // 输入密码
    tapDialogButton4(e) {
        let inputPass = this.data.inputPass;
        let partpass = this.data.formData.partpass
        if (inputPass !== partpass) {
            this.setData({
                showTopTips: true,
                message: '错误！',
                type: 'error'
            });
            return;
        } else {
            this.setData({
                dialog4: false,
                passDis: true
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 获取详细信息
        getRequest("/issure/issure/" + options.id).then((res) => {
            if (res.data.flag) {
                this.setData({
                    formData: res.data.data
                });

                var userInfo = wx.getStorageSync('userInfo');
                if (userInfo !== null && userInfo !== '') {
                    // 获取用户投票信息
                    getRequest("/issure/issure/desc/" + options.id + "/" + userInfo.id).then((res) => {
                        if (res.data.flag) {
                            if (res.data.data !== '' && res.data.data !== null) {
                                this.setData({
                                    choose: res.data.data
                                })
                                let itemTmp = this.data.formData.items;
                                let formDataTmp = this.data.formData;
                                var betTmp = false;
                                // 是否禁用选项
                                for (let i = 0; i < this.data.choose.length; i++) {
                                    if (this.data.choose[i].length !== 0) {
                                        betTmp = true;
                                        break;
                                    }
                                }
                                if (betTmp) {
                                    for (let i = 0; i < itemTmp.length; i++) {
                                        for (let j = 0; j < itemTmp[i].item.length; j++) {
                                            for (let k = 0; k < this.data.choose[i].length; k++) {
                                                if (this.data.choose[i][k] === itemTmp[i].item[j].ans) {
                                                    formDataTmp.items[i].item[j].checked = true;
                                                }
                                            }
                                            formDataTmp.items[i].item[j].dis = true;
                                        }
                                    }
                                    this.setData({
                                        formData: formDataTmp,
                                        buttDis: true
                                    })
                                }
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
            title: this.data.formData.title,
            path: '/pages/component/hall/desc?id=' + this.data.formData.id,
            imageUrl: 'http://hylf.club:8090/images/share.jpeg'
        }
    },

    // 分享到朋友圈
    onShareTimeline() {
        return {
            title: this.data.formData.title,
            imageUrl: 'http://hylf.club:8090/images/share2.jpeg'
        }
    }


})