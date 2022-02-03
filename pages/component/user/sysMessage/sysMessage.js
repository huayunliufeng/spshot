// pages/component/user/sysMessage/sysMessage.js
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
} from "../../../../config.js";
import{
    dateformat
}from "../../../../utils/util.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 分页
        pagination: {
            currentPage: 1,
            pageSize: 10,
            total: 0
        },
        dealList: [],
        showLoding: true,
        showMax: false
    },

    desc(e) {
        wx.navigateTo({
            url: './desc?id=' + e.currentTarget.dataset.id,
        })

    },

    // 初始化数据
    initData() {
        this.setData({
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            }
        });
        var userInfo = wx.getStorageSync('userInfo');
        postRequest("/data/feedback/search/user/" + userInfo.id, this.data.pagination).then((res) => {
            if (res.data.flag) {
                let old = this.data.pagination;
                old.total = res.data.data.total;
                let tmp = res.data.data.rows;
                for(let i = 0;i<tmp.length;i++){
                     tmp[i].dealtime = dateformat(tmp[i].dealtime);
                }
                this.setData({
                    dealList: tmp,
                    pagination: old
                });
                if (res.data.data.rows.length < this.data.pagination.pageSize) {
                    this.setData({
                        showMax: true,
                        showLoding: false
                    })
                } else {
                    this.setData({
                        showMax: false,
                        showLoding: true
                    })
                }
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '请刷新重试'
                });
            }
        }, (err) => {});
        this.setData({
            showLoding: true,
            showMax: false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initData();
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
        // Do something when pull down.
        wx.showNavigationBarLoading();
        this.initData();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.showMax) {
            return;
        }
        let oldPagin = this.data.pagination;
        oldPagin.currentPage = oldPagin.currentPage + 1;
        this.setData({
            pagination: oldPagin
        });
        //   发送分页请求
        var userInfo = wx.getStorageSync('userInfo');
        postRequest("/data/feedback/search/user/" + userInfo.id, this.data.pagination).then((res) => {
            if (res.data.flag) {
                let old = this.data.pagination;
                old.total = res.data.data.total
                let oldData = this.data.dealList;
                let tmp = this.data.data.rows;
                for(let i = 0;i<tmp.length;i++){
                    tmp[i].dealtime = dateformat(tmp[i].dealtime);
               }
                this.setData({
                    dealList: oldData.concat(tmp),
                    pagination: old
                });
                if (res.data.data.rows.length < this.data.pagination.pageSize) {
                    this.setData({
                        showMax: true,
                        showLoding: false
                    })
                } else {
                    this.setData({
                        showMax: false,
                        showLoding: true
                    })
                }
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '请刷新重试'
                });
            }
        }, (err) => {});

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})