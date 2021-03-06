const app = getApp()

Page({
    data: {

    },

    doLogin: function(e) {
        var formObject = e.detail.value;
        var username = formObject.username;
        var password = formObject.password;

        if (username.length == 0 || password.length == 0) {
            wx.showToast({
                title: '用户名或密码不能为空',
                icon: 'none',
                duration: 3000
            })
        } else {
            var server = app.serverUrl;
            wx.showLoading({
                title: '请等待',
            })
            wx.request({
                url: server + '/login',
                method: "POST",
                data: {
                    username: username,
                    password: password
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    console.log(res.data);
                    wx.hideLoading();
                    var status = res.data.status;
                    if (status == 200) {
                        wx.showToast({
                            title: '登陆成功',
                            icon: 'success',
                            duration: 3000
                        });
                        app.userInfo = res.data.data
                        console.log("user: " + app.userInfo.id)
                        wx.navigateTo({
                            url: '../mine/mine',
                        })
                    } else if (status == 500) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 3000
                        })
                    }
                }
            })
        }
    },

    goRegistPage: function() {
        wx.navigateTo({
            url: '../userRegist/regist',
        })
    }
})