const app = getApp()

Page({
    data: {
        server: '',
        bgmList: [],
        videoParams: {}
    },

    onLoad: function (params) {
        var me = this;
        var server = app.serverUrl;
        console.log(params);
        me.setData({
            videoParams: params
        });
        wx.showLoading({
            title: '请等待',
        })
        wx.request({
            url: server + '/bgm/list',
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data);
                wx.hideLoading();
                var status = res.data.status;
                if (status == 200) {
                    var bgmList = res.data.data;
                    me.setData({
                        server: server,
                        bgmList: bgmList
                    })
                }
            }
        })
    },

    upload: function(e) {
        var me = this;
        var server = app.serverUrl;
        var user = app.userInfo;
        var bgmId = e.detail.value.bgmId;
        var desc = e.detail.value.desc;
        var duration = me.data.videoParams.duration;
        var tempCoverUrl = me.data.videoParams.tempCoverUrl;
        var tempHeight = me.data.videoParams.tempHeight;
        var tempViedoUrl = me.data.videoParams.tempViedoUrl;
        var tempWidth = me.data.videoParams.tempWidth;
        wx.showLoading({
            title: '正在上传',
        });
        wx.uploadFile({
            url: server + '/video/upload',
            formData: {
                userId: user.id,
                bgmId: bgmId,
                videoSeconds: duration,
                desc: desc,
                videoHigh: tempHeight,
                videoWeight: tempWidth
            },
            filePath: tempViedoUrl,
            name: 'file',
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                var data = JSON.parse(res.data);
                if (data.status == 200) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '上传成功',
                        icon: 'success',
                        duration: 3000
                    });
                } else if (data.status == 500) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '上传失败',
                        icon: 'none',
                        duration: 3000
                    })
                }
            }
        })
    }
    
})

