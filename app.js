//app.js
App({
  onLaunch: function () {
    /*
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        console.log(res.SDKVersion)
        wx.showModal({
          title: '小程序版本库',
          content: res.SDKVersion,
          showCancel: false
        })
      }
    })
    */
  },
  globalData: {
    settingData: null,
    shareAppMessage: function (){
      return {
        title: '密码匠 - 生成独立密码的计算器',
        path: 'pages/index/index',
        imageUrl: "../../img/shareimg.jpg",
        success: function (res) {
          // 转发成功
          wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (res) {
          // 转发失败
          wx.showToast({
            title: '转发失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  }
})