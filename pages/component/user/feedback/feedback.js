// pages/component/user/feedback/feedback.js
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
} from "../../../../config.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        details: '',
        dialog: false,
        buttons: [{
                text: '取消'
            },
            {
                text: '确认'
            }
        ]
    },

    details(e) {
        this.setData({
            details: e.detail.value
        })
    },

    submit() {
        let userInfo = wx.getStorageSync('userInfo');
        if(userInfo===null||userInfo===''){
            wx.navigateTo({
                url: '/pages/login/login'
            });
            return;
        }
        if (this.data.title === '' || this.data.details === '') {
            this.setData({
                showTopTips: true,
                message: '内容和标题不能为空',
                type: 'error'
            });
            return;
        } else {
            this.setData({
                dialog: true
            })
        }
    },

    //确认
    tapDialogButton(e) {
        console.log(e.detail.item.text)
        if (e.detail.item.text == '确认') {
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

            var userInfo = wx.getStorageSync('userInfo');
            let feedback = {
                userid: userInfo.id,
                username: userInfo.username,
                title: this.data.title,
                details: this.data.details
            };
            postRequest("/data/feedback", feedback).then((res) => {
                if (res.data.flag) {
                    wx.showToast({
                        icon: 'success',
                        title: '等待处理',
                        duration: 3000,
                        success() {
                            wx.switchTab({
                                url: '/pages/component/hall/hall',
                            });
                        }
                    });

                } else {
                    wx.showToast({
                        icon: 'error',
                        title: '请重试'
                    });
                }
                //隐藏
                wx.hideToast()
            }, (err) => {});

        } else {
            this.setData({
                dialog: false
            })
        }

    },

    // 标题
    title(e) {
        this.setData({
            title: e.detail.value
        });
        if (e.detail.value == '') {
            this.setData({
                showTopTips: true,
                message: '标题不能为空',
                type: 'error'
            });
            return;
        };
        
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
    // onShareAppMessage: function () {

    // }
})