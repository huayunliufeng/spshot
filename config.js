/**
 * 小程序配置文件
 */


const baseUrl = 'http://localhost:10020';

let requestCount = 0;
const getRequest = (url) => {
    requestCount++;
    wx.showNavigationBarLoading();
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: 'GET',
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
            complete() {
                requestCount--;
                if (requestCount == 0) {
                    wx.hideNavigationBarLoading();
                }
            }
        })
    })
};
const postRequest = (url, data) => {
    requestCount++;
    wx.showNavigationBarLoading();
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: 'POST',
            data: data,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
            complete() {
                requestCount--;
                if (requestCount == 0) {
                    wx.hideNavigationBarLoading();
                }
            }
        })
    })
};
const putRequest = (url, data) => {
    requestCount++;
    wx.showNavigationBarLoading();
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: 'PUT',
            data: data,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
            complete() {
                requestCount--;
                if (requestCount == 0) {
                    wx.hideNavigationBarLoading();
                }
            }
        })
    })
};
const deleteRequest = (url, data) => {
    requestCount++;
    wx.showNavigationBarLoading();
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            method: 'DELETE',
            data: data,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
            complete() {
                requestCount--;
                if (requestCount == 0) {
                    wx.hideNavigationBarLoading();
                }
            }
        })
    })
}

module.exports = {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
}