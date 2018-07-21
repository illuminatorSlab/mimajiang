//index.js
// 导入预设值
import PRESET from './preset.js';

//获取应用实例
var app = getApp()

// 页首提示语
var headerTips = [
  "信息安全专家建议不要重复使用同一密码（或同一个密码的变种），否则密码类似的账户会有被连环攻破的风险",
  "可是谁记得住几十个复杂密码！",
  "本计算器，可根据【网站/APP】+【统一密码】一键生成复杂密码，只需记住两个参数即可重复获得相同输出",
  "本程序不保存参数和密码，请放心使用",
  "使用结束后请记得【清空剪贴板】，以防其他应用监听"
];

// 设置错误提示
const errorMsg = {
  noText: "请输入APP简称",
  noMode: "请选择生成密码方式"
}

// 设置确认提示
const confirmMsg = {
  noKey: "未输入“统一密码”，将降低生成密码的安全性"
}

// 设置提示语
const hintMsg = {
  text: "推荐使用简单易记的网站/APP简称（大小写敏感）：如myQQ、我的微信",
  key: "请牢记并保密，建议选取较私密的信息（大小写敏感，支持中文）"
}

// 阶乘数表
const factorial = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000]

// 引入加密模块
var Crypto = require('../../utils/cryptojs/cryptojs.js').Crypto;

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
    str += "总长度" + setting.length + "位，";
    str += "其中数字" + setting.length_num + "位，";

    var length_lower = Math.floor((setting.length - setting.length_num) / 2);
    var length_upper = setting.length - setting.length_num - length_lower;

    str += "小写字母" + length_lower + "位，";
    str += "大写字母" + length_upper + "位，";

    for (var i in setting.special){
      str += "特殊符号" + setting.special[i].char + "替换第" + setting.special[i].pos.join(",") + "位；";
    }

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
          var setting = this.getGenerateSetting();
          // console.log(setting);
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
    for (var x in PRESET) {
      pickerAarry.push(PRESET[x].name);
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
    if (e.detail.value == PRESET.length) {
      // console.log(app.globalData.settingData);
      if (app.globalData.settingData == null) {
        // 自定义模式未设置
        app.globalData.settingData = PRESET[0];
        // console.log(PRESET);
      }

      wx.showLoading({
        title: '载入中…',
      })

      wx.navigateTo({
        url: 'setting/setting'
      })
    } else {
      // 修改自定义模式为当前预设值
      app.globalData.settingData = PRESET[e.detail.value];
    }
  },

  // 记录明文
  bindTextChange: function (e) {
    this.setData({
      text: e.detail.value.trim()
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
  getGenerateSetting: function(){
    var mode = this.data.pickerValue;
    // console.log(PRESET);
    if (mode < PRESET.length) {
      // 使用预设
      return PRESET[mode]
    } else {
      // 自定义
      return app.globalData.settingData
    }
  },

  // 十进制转二进制字符串前补零
  decToBinString: function(val) {
    var str = val.toString(2);
    var strZero = "00000000";
    return strZero.substr(0, 8 - str.length) + str;
  },

  // 二进制字符串转数字字符串
  binToDexString: function(str, length) {
    // console.log(str);
    var decStr = parseInt(str, 2).toString();
    while (decStr.length < length) {
      decStr = "0" + decStr;
    }
    return decStr.substr(-length, length);
  },

  // 二进制字符串转字母字符串
  binToLetterString: function (str, length, isLower) {
    // console.log(str);
    var dividend = parseInt(str, 2);
    var divisor = 26;
    var remainder;
    var startCharCode = isLower ? "a".charCodeAt(0) : "A".charCodeAt(0);
    var res = "";

    while (dividend > 0){
      remainder = dividend % divisor;
      res += String.fromCharCode((startCharCode + remainder));

      dividend = Math.floor(dividend / divisor);
    }

    while (res.length < length) {
      res = String.fromCharCode(startCharCode) + res;
    }

    return res.substr(-length, length);
  },

  // 字符串洗牌
  shuffle: function(str, randomSeed){
    var strArray = str.split("");
    var dividend = randomSeed;
    // console.log(randomSeed);
    var n = str.length;
    var remainder, temp;

    while (n > 1) {
      // 取模
      remainder = dividend % n;
      dividend = Math.floor(dividend / n--);

      // 交换
      temp = strArray[n];
      strArray[n] = strArray[remainder];
      strArray[remainder] = temp;
    }

    return strArray.join("");
  },

  // 生成密码
  generateCode: function () {
    // 生成方式
    var setting = this.getGenerateSetting();
    // console.log(setting);

    // 哈希函数选择
    var hashFunction = Crypto.SHA256;

    // 哈希
    var hashRes = "";
    var hashOptions = {
      asBytes: true
    }
    if (this.data.key.length > 0) {
      // HMAC
      hashRes = Crypto.HMAC(hashFunction, this.data.text, this.data.key, hashOptions);
    } else {
      // 普通
      hashRes = hashFunction(this.data.text, hashOptions)
    }
    // console.log(hashFunction);
    // console.log(hashRes);
    hashRes = hashRes.map(this.decToBinString);
    var hashStrBin = hashRes.map(this.decToBinString).join("");
    // console.log(hashStrBin);

    // 生成数字
    var length_num = setting.length_num;
    var length_num_strbin = Math.ceil(Math.log2(Math.pow(10, length_num) - 1));
    var strbin_num = hashStrBin.substr(0, length_num_strbin);
    var pwdNum = this.binToDexString(strbin_num, length_num);
    // console.log(pwdNum);

    // 生成小写字符串
    var length_lower = Math.floor((setting.length - length_num) / 2);
    var length_lower_strbin = Math.ceil(Math.log2(Math.pow(26, length_lower) - 1));
    var strbin_lower = hashStrBin.substr(length_num_strbin, length_lower_strbin);
    var pwdLower = this.binToLetterString(strbin_lower, length_lower, true);
    // console.log(pwdLower);

    // 生成大写字符串
    var length_upper = setting.length - length_num - length_lower;
    var length_upper_strbin = Math.ceil(Math.log2(Math.pow(26, length_upper) - 1));
    var strbin_upper = hashStrBin.substr(length_num_strbin + length_lower_strbin, length_upper_strbin);
    var pwdUpper = this.binToLetterString(strbin_upper, length_upper, false);
    // console.log(pwdUpper);

    var pwdStr = pwdNum + pwdLower + pwdUpper;
    // console.log(pwdStr);

    // 洗牌
    var digit_random = Math.ceil(Math.log2(factorial[setting.length]));
    var randomSeed = parseInt(hashStrBin.substr(length_num_strbin + length_lower_strbin + length_upper_strbin, digit_random), 2);
    var strShuffle = this.shuffle(pwdStr, randomSeed);
    // console.log(strShuffle);

    // 替换特殊字符
    var replaceStr = strShuffle;
    for (var i in setting.special) {
      var x = setting.special[i].char;
      var pos = setting.special[i].pos
      for (var p in pos) {
        replaceStr = this.replacePos(replaceStr, pos[p], x);
      }
    }
    // console.log(replaceStr);

    return replaceStr;
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
