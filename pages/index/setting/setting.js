// pages/setting.js
//获取应用实例
var app = getApp()

// 页首提示语
var headerTips = [
  "本计算器不保存数据，请牢记参数",
  "字符串的位数编号从0开始，你懂的",
  "负数开始位置代表从后往前数",
  "同一特殊符号替换多位，用半角逗号\",\"隔开"
];

// 定义哈希字串最大长度
const maxLength = {
  MD5: 32,
  SHA1: 40,
  SHA256: 64
}

// 定义特殊字符
const specialChar = "!@#$%^&*()_+-={}[]\:;<>?,./";

// 定义大小写模式
const capitalMode = ["odd", "even", "none"]

// 设置错误提示
const errorMsg = {
  inputNaN: "请输入数字",
  inputZero: "请输入大于0的整数",
  maxLength: "无法从哈希字符串中截取位相应长度子串",
  specialCharConflict: "特殊字符冲突",
  specialCharPos: "特殊字符插入位置有误",
  inputError: "输入有误，请检查"
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    headerTips: headerTips,
    setting: null,
    modeArray: Object.keys(maxLength),
    maxLength: maxLength,
    specialCharArray: specialChar.split(""),
    showSpecialAdd: true,
    capitalAarry: ["奇数位", "偶数位", "无大写字母"],
    capitalIndex: null,
    chkInput: {
      sub:{
        start: true,
        length: true
      },
      special: [true, true, true]
    }
  },

  // 获得模式提示信息
  getModeHints: function(){
    return "当前算法产生字串长度为" + maxLength[this.data.setting.mode] +"位";
  },

  // 提示信息
  bindHintTap: function(e){
    var hintMode = e.currentTarget.dataset.hint;
    var msg = "";

    switch (hintMode) {
      case "mode":
        msg = this.getModeHints();
        break;
    }

    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    });
  },

  // 提示错误
  throwError: function(msg){
    wx.showModal({
      title: '错误',
      content: msg,
      showCancel: false
    });
  },

  // 算法更改
  bindModeChange: function(e){
    var setting = this.data.setting;
    setting.mode = this.data.modeArray[e.detail.value];
    this.setData({
      setting: setting
    });

    this.checkAllInput();
  },

  // 检查截取是否成功
  checkSub: function (start, length) {
    if ((start < 0) && (-start < length)) {
      // 负数超界
      return false;
    } else if (start + length > maxLength[this.data.setting.mode]){
      // 正数超界
      return false;
    } else {
      return true;
    }
  },

  // 检查范围开始值
  checkSubStart: function (val) {
    if (isNaN(val)) {
      // 输入非数字
      this.throwError(errorMsg.inputNaN);
      return false;
    } else if (!this.checkSub(val, this.data.setting.sub.length)) {
      // 截取长度大于字符串最大长度
      this.throwError(errorMsg.maxLength);
      return false;
    } else {
      return true;
    }
  },

  // 截取范围开始值更改
  bindSubStartChange: function(e){
    var setting = this.data.setting;
    setting.sub.start = parseInt(e.detail.value);
    var chk = this.checkSubStart(setting.sub.start)

    var chkInput = this.data.chkInput;
    chkInput.sub.start = chk;
    chkInput.sub.length = chk;
    this.setData({
      chkInput: chkInput
    });

    if (chk){
      // 输入正确
      this.setData({
        setting: setting
      });
    }
  },

  // 检查截取范围长度
  checkSubLength: function (val) {
    if (isNaN(val)) {
      // 输入非数字
      this.throwError(errorMsg.inputNaN);
      return false;
    } else if (val < 1) {
      // 输入长度
      this.throwError(errorMsg.inputZero);
      return false;
    } else if (!this.checkSub(this.data.setting.sub.start, val)) {
      // 截取长度大于字符串最大长度
      this.throwError(errorMsg.maxLength);
      return false;
    } else {
      // 输入正确
      return true;
    }
  },

  // 截取范围长度更改
  bindSubLengthChange: function(e){
    var setting = this.data.setting;
    setting.sub.length = parseInt(e.detail.value);

    var chk = this.checkSubLength(setting.sub.length)

    var chkInput = this.data.chkInput;
    chkInput.sub.start = chk;
    chkInput.sub.length = chk;

    // 检查插入字符位置是否有误
    for (var i in this.data.setting.special) {
      chkInput.special[i] = this.data.setting.special[i].pos.every(this.checkSpecialPos);
    }

    this.setData({
      chkInput: chkInput
    });

    if (chk) {
      // 输入正确
      this.setData({
        setting: setting
      });
    }
  },

  // 检查特殊字符
  checkSpecialChar: function (chr, index){
    // 检查是否已经被使用
    var spcStr = "";
    for (var i in this.data.setting.special) {
      if (i != index) {
        spcStr += this.data.setting.special[i].char;
      }
    }

    if (spcStr.indexOf(chr)>-1){
      // 有重复
      this.throwError(errorMsg.specialCharConflict);
      return false;
    } else {
      // 无重复
      return true;
    }
  },

  // 特殊字符更改
  bindSpecialCharChange: function (e) {
    // console.log(e);
    var chr = specialChar.charAt(e.detail.value);
    var index = e.currentTarget.dataset.index;

    var chk = this.checkSpecialChar(chr, index)

    if (chk){
      var setting = this.data.setting;
      setting.special[index].char = chr;
      // 输入正确
      this.setData({
        setting: setting
      });
    }
  },

  // 检查特殊字符替换位置
  checkSpecialPos: function(p) {
    if (isNaN(p)){
      // 输入非数字
      return false;
    } else if (p < 0){
      // 输入负数
      return false;
    } else if (p > this.data.setting.sub.length - 1){
      // 输入超界
      return false;
    } else {
      // 正确输入
      return true;
    }
  },

  // 特殊字符替换位置更改
  bindSpecialPosChange: function(e) {
    var pos = e.detail.value.split(",");
    pos = pos.map(function (num) { return parseInt(num, 10); });
    // console.log(pos);
    var index = e.currentTarget.dataset.index;

    var chk = pos.every(this.checkSpecialPos)
    var chkInput = this.data.chkInput;
    chkInput.special[index] = chk;
    this.setData({
      chkInput: chkInput
    });

    if (chk){
      // 输入正确
      var setting = this.data.setting;
      setting.special[index].pos = pos;
      this.setData({
        setting: setting
      });
    } else {
      // 输入非法
      this.throwError(errorMsg.specialCharPos);
    }
  },

  // 增加特殊字符
  bindSpecialAdd: function () {
    var setting = this.data.setting;
    var specialStr = specialChar;

    for (var i in setting.special) {
      specialStr = specialStr.replace(setting.special[i].char,"");
    }

    var charToAdd = specialStr.charAt(0);
    setting.special.push({
      char: charToAdd,
      pos: [0]
    });

    this.setData({
      setting: setting
    });

    if (setting.special.length > 2) {
      this.setData({
        showSpecialAdd: false
      });
    }
  },

  // 更改大写位置设置
  bindCapitalChange: function (e) {
    var capitalIndex = e.detail.value;
    var setting = this.data.setting;
    setting.capital = capitalMode[capitalIndex];

    // 写入设置
    this.setData({
      setting: setting, 
      capitalIndex: capitalIndex
    });
  },

  // 检查所有输入框
  checkAllInput: function(){
    var chkSubStart = this.checkSubStart(this.data.setting.sub.start);
    var chkSubLength = this.checkSubLength(this.data.setting.sub.length);
    var chkSpecial = [true, true, true];
    for (var x in this.data.setting.special) {
      chkSpecial[x] = this.data.setting.special[x].pos.every(this.checkSpecialPos);
    }

    var chkInput = {
      sub: {
        start: chkSubStart,
        length: chkSubLength
      },
      special: chkSpecial
    }

    this.setData({
      chkInput: chkInput
    });

    return chkSubStart && chkSubLength && chkSpecial.every(function(val){ return val;});
  },

  // 检查是否还有输入框未修正
  checkInputError: function(){
    var chkSubStart = this.data.chkInput.sub.start;
    var chkSubLength = this.data.chkInput.sub.length;
    var chkSpecial = this.data.chkInput.special;

    return chkSubStart && chkSubLength && chkSpecial.every(function (val) { return val; });
  },

  /**
   * 确认设置
   */
  bindConfirm: function() {
    if (this.checkInputError()) {
      app.globalData.settingData = this.data.setting;
      wx.navigateBack();
    } else {
      this.throwError(errorMsg.inputError);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化数据
    this.setData({
      setting: app.globalData.settingData,
      capitalIndex: capitalMode.indexOf(app.globalData.settingData.capital),
      showSpecialAdd: (app.globalData.settingData.special.length < 3)
    });
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
    wx.hideLoading();
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})