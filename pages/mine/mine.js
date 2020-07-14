const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
  },

  onLoad: function () {
      var me = this;
      var server = app.serverUrl;
      var user = app.userInfo;

      wx.showLoading({
          title: '请等待',
      })
      wx.request({
          url: server + '/user/query?userId=' + user.id,
          method: "POST",
          header: {
              'content-type': 'application/json' // 默认值
          },
          success: function (res) {
              console.log(res.data);
              wx.hideLoading();
              var status = res.data.status;
              if (status == 200) {
                  var userInfo = res.data.data;
                  var faceUrl = "../resource/images/noneface.png";
                  if (userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage != undefined) {
                      faceUrl = server + userInfo.faceImage;
                  }
                  me.setData({
                      faceUrl: faceUrl,
                      nickname: userInfo.nickname,
                      fansCounts: userInfo.fansCounts,
                      followCounts: userInfo.followCounts,
                      receiveLikeCounts: userInfo.receiveLikeCounts
                  })
              }
          }
      })
  },

  logout: function () {
      var user = app.userInfo;
      var server = app.serverUrl;
      console.log(user.id)
      wx.showLoading({
          title: '请等待',
      })
      wx.request({
          url: server + '/logout?userId=' + user.id,
          method: "POST",
          header: {
              'content-type': 'application/json' // 默认值
          },
          success: function (res) {
              console.log(res.data);
              wx.hideLoading();
              var status = res.data.status;
              if (status == 200) {
                  wx.showToast({
                      title: '注销成功',
                      icon: "success",
                      duration: 3000
                  });
                  app.userInfo = null;
                  wx.navigateTo({
                      url: '../userLogin/login',
                  });
              } else if (status == 500) {
                  wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 3000
                  })
              }
          }
      })
  },

  changeFace: function(){
      var me = this;
      var user = app.userInfo;
      var server = app.serverUrl;
      wx.showLoading({
          title: '正在上传',
      })
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
              const tempFilePaths = res.tempFilePaths;
              console.log(tempFilePaths);
              wx.uploadFile({
                  url: server + '/user/uploadFace?userId=' + user.id, 
                  filePath: tempFilePaths[0],
                  name: 'file',
                  success(res) {
                      var data = JSON.parse(res.data);
                      if (data.status == 200) {
                          wx.hideLoading();
                          wx.showToast({
                              title: '上传成功',
                              icon: 'success',
                              duration: 3000
                          });
                          var imageUrl = data.data;
                          me.setData({
                              faceUrl: server + imageUrl
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
  },

  uploadVideo: function(){
      var me = this;
      wx.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 21,
          camera: 'back',
          success(res) {
              console.log(res);
              var duration = res.duration;
              var tempHeight = res.height;
              var tempWidth = res.width;
              var tempViedoUrl = res.tempFilePath;
              var tempCoverUrl = res.thumbTempFilePath;
              
              if (duration > 21) {
                  wx.showToast({
                      title: '视频长度不能超过20秒',
                      duration: 3000,
                      icon: 'none'
                  })
              } else if (duration < 1) {
                  wx.showToast({
                      title: '视频长度过短',
                      icon: 'none', 
                      duration: 3000
                  })
              } else {
                  wx.navigateTo({
                      url: '../chooseBgm/chooseBgm?duration=' + duration
                          + '&tempHeight=' + tempHeight
                          + '&tempWidth=' + tempWidth
                          + '&tempViedoUrl=' + tempViedoUrl
                          + '&tempCoverUrl=' + tempCoverUrl,
                  })
              }
          }
      })


  }

})
