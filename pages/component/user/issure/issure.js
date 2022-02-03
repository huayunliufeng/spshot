// pages/issure/issure.js
import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
} from "../../../../config.js";
import {
    dateformat
} from "../../../../utils/util.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        style1: 'ison',
        style2: 'isno',
        show: 0,
        tableData: [],
        //正在加载
        showLoding: true,
        //暂无数据
        showMax: false,
        pagination: { //分页相关属性
            currentPage: 1,
            pageSize: 10,
            total1: 0,
            total2: 0,
            queryString: ''
        }
    },

    // 搜索
    search: function (e) {
        let oldPagin = this.data.pagination;
        oldPagin.queryString = e.detail.value;
        oldPagin.currentPage = 1;
        this.setData({
            pagination: oldPagin
        });
        //获取数据
        var userInfo = wx.getStorageSync('userInfo');
        postRequest("/issure/issure/show/issure/" + userInfo.id + "/" + this.data.show, this.data.pagination).then((res) => {
            if (res.data.flag) {
                if(res.data.data==null){
                    this.setData({
                        showMax: true,
                        showLoding: false
                    });
                    return;
                }
                let oldPagin = this.data.pagination;
                if (this.data.show === 0) {
                    oldPagin.total1 = res.data.data.total
                } else {
                    oldPagin.total2 = res.data.data.total
                }
                let tmp = res.data.data.rows;
                for (let i = 0; i < tmp.length; i++) {
                    tmp[i].accepttime = dateformat(tmp[i].accepttime);
                    tmp[i].createtime = dateformat(tmp[i].createtime);
                    tmp[i].username = tmp[i].username.substring(0, 15)
                }
                this.setData({
                    tableData: tmp,
                    pagination: oldPagin
                });
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
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '请返回重试'
                });
            }
        }, (err) => {});

    },
    // 切换页面
    pass() {
        this.setData({
            show: 1,
            style1: 'isno',
            style2: 'ison'
        });
        this.initTableData();
    },

    // 切换页面
    verify() {
        this.setData({
            show: 0,
            style1: 'ison',
            style2: 'isno'
        });
        this.initTableData();
    },


    // 初始化数据
    initTableData() {
        let oldPagin = this.data.pagination;
        oldPagin.currentPage = 1;
        oldPagin.queryString = '';
        this.setData({
            pagination: oldPagin
        });
        //获取数据
        var userInfo = wx.getStorageSync('userInfo');
        postRequest("/issure/issure/show/issure/" + userInfo.id + "/" + this.data.show, this.data.pagination).then((res) => {
            if (res.data.flag) {
                if(res.data.data==null){
                    this.setData({
                        showMax: true,
                        showLoding: false
                    });
                    return;
                }
                console.log(res.data.data.rows)
                let oldPagin = this.data.pagination;
                if (this.data.show === 0) {
                    oldPagin.total1 = res.data.data.total
                } else {
                    oldPagin.total2 = res.data.data.total
                }
                let tmp = res.data.data.rows;
                for (let i = 0; i < tmp.length; i++) {
                    tmp[i].accepttime = dateformat(tmp[i].accepttime);
                    tmp[i].createtime = dateformat(tmp[i].createtime);
                    tmp[i].username = tmp[i].username.substring(0, 15)
                }
                this.setData({
                    tableData: tmp,
                    pagination: oldPagin
                });
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
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '请返回重试'
                });
            }
        }, (err) => {});
    },

    // 加载更多
    loadData() {
        if (this.data.showMax) {
            return;
        }
        let oldPagin = this.data.pagination;
        oldPagin.currentPage = oldPagin.currentPage + 1;
        this.setData({
            pagination: oldPagin
        });

        var userInfo = wx.getStorageSync('userInfo');
        postRequest("/issure/issure/show/issure/" + userInfo.id + "/" + this.data.show, this.data.pagination).then((res) => {
            if (res.data.flag) {
                if(res.data.data==null){
                    this.setData({
                        showMax: true,
                        showLoding: false
                    });
                    return;
                }
                let oldPagin = this.data.pagination;
                if (this.data.show === 0) {
                    oldPagin.total1 = res.data.data.total
                } else {
                    oldPagin.total2 = res.data.data.total
                }
                let old = this.data.tableData;
                let tmp = res.data.data.rows;
                for (let i = 0; i < tmp.length; i++) {
                    tmp[i].accepttime = dateformat(tmp[i].accepttime);
                    tmp[i].createtime = dateformat(tmp[i].createtime);
                    tmp[i].username = tmp[i].username.substring(0, 15)
                }
                this.setData({
                    tableData: old.concat(tmp),
                    pagination: oldPagin
                });
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
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '请返回重试'
                });
            }
        }, (err) => {});
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initTableData();
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
        this.initTableData();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
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