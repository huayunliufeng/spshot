// pages/issure/ispass.js
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
        formData: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        getRequest("/issure/issure/desc/res/" + options.id).then((res) => {
            if (res.data.flag) {
                let tmp = res.data.data;
                for (let i = 0; i < tmp.items.length; i++) {
                    for (let j = 0; j < tmp.items[i].item.length; j++) {
                        tmp.items[i].item[j].ans = tmp.items[i].item[j].ans.substring(0, 30)
                    }
                }
                this.setData({
                    formData: tmp
                });
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '请返回重试'
                });
            }
        }, (err) => {});

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
            path: '/pages/component/user/issure/ispass?id=' + this.data.formData.id,
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