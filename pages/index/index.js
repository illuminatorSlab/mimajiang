//index.js
//获取应用实例
var app = getApp()

// 页首提示语
var headerTips = [
  "信息安全专家建议不要重复使用同一密码（或同一个密码的变种），否则密码类似的账户会有被连环攻破的风险",
  "可是谁记得住几十个复杂密码！",
  "本计算器，可根据【网站/APP名】+【统一密码】一键生成复杂密码，只需记住两个参数即可重复获得相同输出",
  "本程序不保存参数和密码，请放心使用",
  "使用结束后请记得【清空剪贴板】，以防其他应用监听"
];

// 引入加密模块
var Crypto = require('../../utils/cryptojs/cryptojs.js').Crypto;

// 设置预设值
const preset = [
  {
    name: "16位密码",
    mode: "SHA256",
    sub: {
      start: 29,
      length: 16
    },
    special: [
      {
        char: "_",
        pos: [6]
      },
      {
        char: "@",
        pos: [10]
      }
    ],
    capital: "odd"
  },
  {
    name: "14位密码",
    mode: "SHA1",
    sub: {
      start: 5,
      length: 14
    },
    special: [
      {
        char: "_",
        pos: [8]
      }
    ],
    capital: "even"
  },
  {
    name: "12位密码",
    mode: "MD5",
    sub: {
      start: -12,
      length: 12
    },
    special: [
      {
        char: "_",
        pos: [7]
      }
    ],
    capital: "odd"
  }
]

// 设置错误提示
const errorMsg = {
  noText: "请输入APP名称",
  noMode: "请选择生成密码方式"
}

// 设置确认提示
const confirmMsg = {
  noKey: "未输入统一密码，将降低生成密码的安全性"
}

// 设置提示语
const hintMsg = {
  text: "推荐使用简单易记的网站/APP简称（大小写敏感）：如myQQ、我的微信",
  key: "请牢记并保密，建议选取较私密的信息（大小写敏感，支持中文）",
  mode: "请选择预设或自定义设置"
}

const capticalHint = {
  odd: "奇数位", 
  even: "偶数位",
  none: "无大写字母"
}

Page({
  data: {
    headerTips: headerTips,
    viewDesc: false,
    pickerAarry: [],
    pickerValue: 0,
    text: "",
    key: "",
    pwd: ""
  },
  // 查看提示
  bindViewDesc: function() {
    this.setData({
      viewDesc: !this.data.viewDesc
    });
  },

  // 获取针对加密预设的提示
  getSettingHint: function(setting) {
    // console.log(setting);
    var str = "当前密码生成模式为“" + setting.name + "”：";
    str += setting.mode + "算法；";
    str += "从第" + setting.sub.start + "位开始截取" + setting.sub.length + "位字符串；";
    for (var i in setting.special){
      str += "特殊符号" + setting.special[i].char + "替换第" + setting.special[i].pos.join(",") + "位；";
    }

    str += "大写字母：" + capticalHint[setting.capital];

    return str;
  },

  // 显示提示
  bindHintTap: function (e) {
    var hintMode = e.currentTarget.dataset.hint;
    var msg = "";

    switch (hintMode) {
      case "text":
        // 明文提示
        msg = hintMsg.text;
        break;
      case "key":
        // 密钥提示
        msg = hintMsg.key;
        break;
      case "mode":
        // 设置提示
        if (this.data.pickerValue != null) {
          var setting = this.getGeneratrSetting();
          msg = this.getSettingHint(setting);
          // console.log(msg);
        } else {
          // 未设置
          msg = hintMsg.mode;
        }
        break;
    }

    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    });
  },

  // 生成加密方式选项值
  generatePicker: function(){
    var pickerAarry = []
    for (var x in preset) {
      pickerAarry.push(preset[x].name);
    }

    pickerAarry.push("自定义");

    this.setData({
      pickerAarry: pickerAarry
    });
  },
  // 记录加密方式选项
  bindModeChange: function (e) {
    this.setData({
      pickerValue: e.detail.value
    })

    // 是否为自定义模式
    if (e.detail.value == preset.length) {
      // console.log(app.globalData.settingData);
      if (app.globalData.settingData == null) {
        // 自定义模式未设置
        
        app.globalData.settingData = preset[2];
        app.globalData.settingData.name = "自定义";
      }

      wx.showLoading({
        title: '载入中…',
      })

      wx.navigateTo({
        url: 'setting/setting'
      })
    }
  },

  // 记录明文
  bindTextChange: function (e) {
    this.setData({
      text: e.detail.value
    })
  },

  // 记录密钥
  bindKeyChange: function (e) {
    this.setData({
      key: e.detail.value
    })
  },

  // 记录密码更改
  bindPwdChange: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },

  // 复制到剪贴板
  bindCopy: function() {
    if (wx.canIUse("setClipboardData")){
      // 可以调用剪贴板
      var pwd = this.data.pwd
      wx.setClipboardData({
        data: pwd,
        success: function () {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function() {
          wx.showToast({
            title: '复制失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '微信小程序不支持调用剪贴板，请长按密码复制',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 清空剪贴板
  bindClear: function () {
    this.setData({
      pwd: ""
    });

    if (wx.canIUse("setClipboardData")) {
      // 可以调用剪贴板
      wx.setClipboardData({
        data: " ",
        success: function () {
          wx.showToast({
            title: '清空完成',
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '微信小程序不支持调用剪贴板，请手动清空',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 检查输入
  checkInput: function() {
    var res = {
      check: "success",
      message: ""
    }
  
    // 明文为空
    if (this.data.text.length == 0){
      res.check = "error";
      res.message = errorMsg.noText;
      return res;
    }

    // 加密方式未选择
    if (this.data.pickerValue == null) {
      res.check = "error";
      res.message = errorMsg.noMode;
      return res;
    }
    
    // 密钥为空
    if (this.data.key.length == 0) {
      res.check = "confirm";
      res.message = confirmMsg.noKey;
      return res;
    }

    return res;
  },
  // 替换字符串内字符
  replacePos: function (strObj, pos, replacetext) {
    var str = strObj.substring(0, pos) + replacetext + strObj.substring(pos+1);
    return str;
  },

  // 获取生成密码设定
  getGeneratrSetting: function(){
    var mode = this.data.pickerValue;
    if (mode < preset.length) {
      // 使用预设
      return preset[mode]
    } else {
      // 自定义
      return app.globalData.settingData
    }
  },

  // 生成密码
  generateCode: function() {
    // 生成方式
    var setting = this.getGeneratrSetting();
    // console.log(setting);

    // 哈希函数选择
    var hashFunction;
    switch (setting.mode) {
      case "MD5":
        hashFunction = Crypto.MD5;
        break;
      case "SHA1":
        hashFunction = Crypto.SHA1;
        break;
      case "SHA256":
        hashFunction = Crypto.SHA256;
        break;
    }
    
    // 哈希
    var strHash = "";
    if (this.data.key.length > 0) {
      // HMAC
      strHash = Crypto.HMAC(hashFunction, this.data.text, this.data.key);
    } else {
      // 普通
      strHash = hashFunction(this.data.text)
    }
    // console.log(hashFunction);
    // console.log(strHash);

    // 截取
    var strSub = strHash.substr(setting.sub.start, setting.sub.length);

    // 替换特殊字符
    var replaceStr = strSub;
    for (var i in setting.special) {
      var x = setting.special[i].char;
      var pos = setting.special[i].pos
      for (var p in pos) {
        replaceStr = this.replacePos(replaceStr, pos[p], x);
      }
    }
    // console.log(replaceStr);

    // 大小写
    var pwdStr = "";

    if (setting.capital == "none") {
      // 不处理
      pwdStr = replaceStr;

    } else {
      var lowerStr = replaceStr;
      var capitalStr = lowerStr.toUpperCase();
      var i = 0;

      if (setting.capital == "even") {
        // 偶数位大写
        pwdStr += capitalStr.charAt(i++);
      }
      // 正常处理
      while (i < lowerStr.length) {
        pwdStr += lowerStr.charAt(i++);
        pwdStr += i < capitalStr.length ? capitalStr.charAt(i++) : "";
      }
    }

    // console.log(pwdStr);
    return pwdStr;
  },
  // 生成按钮
  generateButton: function() {
    // 判断参数是否合法
    var chk = this.checkInput();
    var pwd = "";

    if (chk.check == "error") {
      // 错误
      wx.showModal({
        title: '错误',
        content: chk.message,
        showCancel: false
      });
      return;
    } else if (chk.check == "confirm") {
      // 确认
      var that = this;
      wx.showModal({
        title: '警告',
        content: chk.message + '，是否继续？',
        confirmText: "继续",
        cancelText: "取消",
        success: function (res) {
          // console.log(res);
          if (res.confirm) {
            // 用户确认
            pwd = that.generateCode();
            that.setData({
              pwd: pwd
            });
          } else {
            // 用户取消
            return;
          }
        }
      });
    } else {
      // 查无错误
      pwd = this.generateCode();
      this.setData({
        pwd: pwd
      });
    }
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 生成加密方式选项值
    this.generatePicker();
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: app.globalData.shareAppMessage
})
