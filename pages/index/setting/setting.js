// pages/setting.js
//获取应用实例
var app = getApp()

// 页首提示语
var headerTips = [
  "本计算器不保存设定，请牢记参数！牢记参数！",
  "字母位数会根据密码长度和数字位数自动计算得出",
  "字符串的位数编号从0开始，你懂的",
  "同一特殊符号替换多位，用半角逗号\",\"隔开"
];

// 定义生成密码最大长度
const lengthLimit = {
  maxL: 18,
  minL: 8,
  maxNL: 10,
  minNL: 2
}

// 定义特殊字符
const specialChar = "!@#$%^&*()_+-={}[]\:;<>?,./";

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
    lengthLimit: lengthLimit,
    blockSize: 17,
    specialCharArray: specialChar.split(""),
    showSpecialAdd: true,
    chkInput: {
      special: [true, true, true]
    }
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

  // 密码长度更改
  bindLengthChange: function(e){
    var setting = this.data.setting;
    setting.length = e.detail.value;
    
    if (setting.length_num > setting.length - 2) {
      // 留给字符的位数少于两位
      setting.length_num = setting.length - 2
    }
    this.setData({
      setting: setting
    });

    // 检查输入框
    this.checkAllInput();
  },

  // 检查数字位数是否合规
  checkLengthNum: function(lengthNum){
    if (lengthNum > this.setting.length - 2) {
      // 留给字符的位数少于两位
      return false;
    } else {
      return true;
    }
  },

  // 绑定数字位数更改
  bindLengthNumChange: function(e) {
    var setting = this.data.setting;
    setting.length_num = e.detail.value;
    this.setData({
      setting: setting
    });
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
    } else if (p > this.data.setting.length - 1){
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

  // 检查所有输入框
  checkAllInput: function(){
    var chkSpecial = [true, true, true];
    for (var x in this.data.setting.special) {
      chkSpecial[x] = this.data.setting.special[x].pos.every(this.checkSpecialPos);
    }

    var chkInput = {
      special: chkSpecial
    }

    this.setData({
      chkInput: chkInput
    });

    return chkSpecial.every(function(val){ return val;});
  },

  // 检查是否还有输入框未修正
  checkInputError: function(){
    var chkSpecial = this.data.chkInput.special;

    return chkSpecial.every(function (val) { return val; });
  },

  /**
   * 确认设置
   */
  bindConfirm: function() {
    if (this.checkInputError()) {
      app.globalData.settingData = this.data.setting;
      app.globalData.settingData.name = "自定义";
      wx.navigateBack();
    } else {
      this.throwError(errorMsg.inputError);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 初始化数据
    this.setData({
      setting: app.globalData.settingData,
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