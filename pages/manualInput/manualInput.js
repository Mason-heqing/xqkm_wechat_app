// pages/manualInput/manualInput.js
import WxValidate from '../../utils/WxValidate.js'
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    serialContent:false,
    namesContent:false,
    isAdddeviceType:2,
     form:{
       id:'',
       name:'',
       serial:''
     }
  },

  trimSerial(e){
    const that = this;
    if('' != e.detail.value){
      that.setData({
        ['form.serial']:e.detail.value.replace(/\s+/g, ''),
        serialContent:true,
      })
    }else{
      that.setData({
        ['form.serial']:'',
        serialContent:false,
      })
    }
  },

  trimName(e){
    const that = this;
    if('' != e.detail.value){
      that.setData({
        ['form.name']:e.detail.value.replace(/\s+/g, ''),
        namesContent:true
      })
    }else{
      that.setData({
        ['form.name']:'',
        namesContent:false
      })
    }
  },

  //报错 
  showModal(error) {
    wx.showModal({
      content: error,
      showCancel: false,
    })
  },

  //验证函数
  initValidate() {
    let messages = {};
    let rules = {};
    rules = {
      serial: {
        required: true,
      },
    }
    messages = {
      serial: {
        required: '请填写设备SN号',
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

   //提交表单
   formSubmit(e){
    const that = this;
    let params = e.detail.value;
    let appId = wx.getStorageSync('currentAppId');
    if (!that.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error.msg)
      return false
    }else{
      //发送请求
      if(that.data.preventDuplication){
        console.log("appid:---",appId)
        if(undefined != appId && '' != appId){
          console.log("params:",params)
          that.send(params)
        }else{
          wx.showToast({
            title: '当前没有项目，请先创建项目',
            icon: 'none',
            duration: 2000
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '../addProject/addProject?ble=2&name='+'' + '&serial=' + that.data.form.serial
            })
          },1000)
        }
      }
      that.setData({
        preventDuplication:false,
      })
    } 
  },

  send(data){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    let scanCodeFlag = null;
    if('1' == that.data.isAdddeviceType){
      scanCodeFlag = true;
    }else{
      scanCodeFlag = false;
    }
    wx.showLoading({
      title: '提交中',
    })
    req.request("post","device/update",{
      "appId": appId,
      "id":data.id,
      "name": data.name,
      "serial": data.serial,
      "idCard": data.idCard,
      "scanCodeFlag":scanCodeFlag,
    }).then(res=>{
      wx.hideLoading();
      that.setData({
        preventDuplication:true,
      })
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '手动录入成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },2000)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const that = this;
     let scanCode = wx.getStorageSync('scanCode');
     if(scanCode && undefined != scanCode){
      that.setData({
        isAdddeviceType:1
      });
      wx.setNavigationBarTitle({
        title: '添加设备' 
      })
      if(-1 == scanCode.indexOf('QFT')){
        let serial = that.getQueryVariable(scanCode,'mac');
        // console.log("扫码：",serial);
        that.setData({
          serialContent:true,
          ['form.serial']:serial,
        })
      }else{
        let qft =  scanCode.split('/')[2];
        that.setData({
          serialContent:true,
          ['form.serial']:qft,
        })
      }
     }else{
      that.setData({
        isAdddeviceType:2
      });
     }
     that.initValidate() //验证规则函数
  },

  //获取url参数
  getQueryVariable (url,parameter){
    var vars = url.split("?");
    console.log("vars:",vars);
    var serial = vars[1].split("&");
    var sn = serial[0].split("=")
    console.log("serial:",sn[1]);
    return sn[1]
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
    wx.removeStorageSync('scanCode');
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})