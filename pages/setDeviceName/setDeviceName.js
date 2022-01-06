// pages/setDeviceName/setDeviceName.js
const app = getApp();
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpen:true,
    openSetPassword:false,
    preventDuplication:true,
    namesContent:false,
    inputValue:'',
    deviceId:'',
    password:'',
     form:{
      id:'',
      name:'',
      serial:'',
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

  passwordChange(e){
    let that = this;
    let value = that.validateNumber(e.detail.value)
    that.setData({
      password: value
    })
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  modalConfirm(){
    const that = this;
     if('' == that.data.password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        isOpen:true,
        openSetPassword:true
      })
     }else if(that.data.password.length < 8){
      wx.showToast({
        title: '请设置8位数的密码',
        icon: 'none',
        duration: 2000
      }) 
      that.setData({
        isOpen:true,
        openSetPassword:true
      })
     }else{ 
      that.setData({
        isOpen:false,
      }) 
      wx.showLoading({
        title: '设置中',
      })
    req.request("post","device/config/super/pwd?deviceId="+that.data.form.id+"&pwd=" + that.data.password,{}).then(res=>{
      that.setData({
        isOpen:true,
        preventDuplication:true
      }) 
      wx.hideLoading();
      that.setData({
        password:''
      })
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '设置密码成功',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          openSetPassword:false
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
     }
  },

  submit(){
    const that = this;
     let getName = that.data.form.name;
     if("" != getName){
      let appId = wx.getStorageSync('currentAppId');
      console.log("isopen:",that.data.isOpen)
      if(that.data.preventDuplication && that.data.isOpen){
        wx.showLoading({
          title: '提交中',
        })
        req.request("post","device/update",{
          "appId": appId,
          "id":that.data.form.id,
          "name": that.data.form.name,
          "serial": that.data.form.serial,
        }).then(res=>{
          wx.hideLoading();
          that.setData({
            preventDuplication:true,
          })
          if(res.data.code && 200 == res.data.code){
            wx.showToast({
              title: '设备名称修改成功',
              icon: 'none',
              duration: 2000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },2000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        });
      }
      that.setData({
        preventDuplication:false,
      })
     }else{
      wx.showModal({
        content: '设备名称不能为空！',
        showCancel: false,
      })
     }
  },

  delete(e){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    if(that.data.preventDuplication && that.data.isOpen){
      req.request("post","device/delete",{
        "appId":appId,
        "deviceIdList": [that.data.form.id],
      }).then(res=>{
        that.setData({
          preventDuplication:true
        })
        wx.hideLoading();
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: '设备解绑成功',
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
        }
      });
    }
    that.setData({
      preventDuplication:false
    })
    
  },

  deviceDelete(){
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定解除绑定吗？',
      success (res) {
        if (res.confirm) {
         that.delete();
        } else if (res.cancel) {
          
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log("options:",options);
     const that = this;
     if(options.deviceId && '' != options.deviceId){
        that.setData({
          ['form.id']:options.deviceId,
          ['form.name']:options.deviceName,
          ['form.serial']:options.serial,
          namesContent:true
        })
     }else{
      that.setData({
        ['form.id']:options.deviceId,
        ['form.serial']:app.globalData.serial,
        namesContent:false
      })
     }
  },

  //设置密码
  setPassword(){
    const that = this;
    if(that.data.isOpen){
      that.setData({
        openSetPassword:true,
      })
    }
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
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    if (wxPrevPage){
      //修改上级页面的数据
        wxPrevPage.onPullDownRefresh();
      }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2];//获取上级页面的page对象
    if (wxPrevPage){
      //修改上级页面的数据
        wxPrevPage.onPullDownRefresh();
      }
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