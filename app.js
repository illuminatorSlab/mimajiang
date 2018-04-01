//app.js
App({
  onLaunch: function () {
    /*
    wx.showToast({
      title: '本程序不保存密码及设置，使用后请点击清空剪贴板',
      icon: 'none',
      duration: 3000
    })
    // Test
    
    var Crypto = require('utils/cryptojs/cryptojs.js').Crypto;
    console.log(Crypto);
    console.log(Crypto.MD5("123"));
    console.log(Crypto.HMAC(Crypto.MD5, "123", "2018"));

    wx.showToast({
      title: '测试一下一行提示最多能到多少字哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈啊哈哈哈',
      icon: 'none',
      duration: 2000
    })
    

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    */
  },
  globalData: {
    settingData: null,
    shareAppMessage: function (){
      return {
        title: '密码匠 - 密码生成小程序',
        path: '/index/index',
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