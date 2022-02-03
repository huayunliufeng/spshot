// pages/component/user/sysMessage/desc.js
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
} from "../../../../config.js";
import {
    dateformat2,dateformat
} from "../../../../utils/util.js"
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
        getRequest("/data/feedback/desc/deal/" + options.id).then((res) => {
            if (res.data.flag) {
                let tmp = res.data.data;
                tmp.dealtime = dateformat(tmp.dealtime);
                this.setData({
                    formData: tmp
                });
                // 设置已读
                if (this.data.formData.state !== 1) {
                    getRequest("/data/feedback/isread/" + options.id).then((res) => {
                        if (res.data.flag) {

                        }
                    }, (err) => {});
                }

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
    // onShareAppMessage: function () {

    // }
})