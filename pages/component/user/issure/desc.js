// pages/issure/desc.js
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
        choose: [],
        formData: {}
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var userInfo = wx.getStorageSync('userInfo');
        getRequest("/issure/issure/" + options.id).then((res) => {
            if (res.data.flag) {
                // 设置选项信息
                this.setData({
                    formData: res.data.data
                });
                // 获取用户投票信息
                getRequest("/issure/issure/desc/" + this.data.formData.id + "/" + userInfo.id).then((res) => {
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
                    }
                }, (err) => {});
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