// pages/cardFormat/cardFormat.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    mode:null,
    name:0,
    items: []
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    const that = this;
    that.setData({
      mode:e.detail.value,
      name:app.globalData.dataCardFormat.optionName[e.detail.value],
    })
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }  
  },
  
  cardFormat(){
    const that = this;
    let dataCardFormat = app.globalData.dataCardFormat;
    let data = [];
    for(let i =0;i<dataCardFormat.optionName.length;i++){
      let json = {};
      json.value = dataCardFormat.optionValue[i];
      json.name = dataCardFormat.optionName[i];
      data.push(json)
    }
    let index = app.globalData.dataCardFormat.value;
    data[index].checked="true";
   that.setData({
     mode:index,
     items:data
   })
  },

  submit(){
     const that = this;
     let formData = parseInt(that.data.mode);
     let pages = getCurrentPages();   //当前页面
     let prevPage = pages[pages.length - 2];   //上一页面
     console.log(prevPage);
     prevPage.setData({
      indexCardFormat:formData,
       ['form.cardFormat']:that.data.name,
     })
     wx.navigateBack({
       delta: 1
     })
    //  let sendJson = {};
    //  let json = {};
    //  json.cardFormat = formData;
    //  sendJson.general = json;
    // req.request("post","device/config/set",{
    //   dataConfigStr:sendJson,
    //   deviceId:that.data.deviceId,
    // }).then(res=>{
    //   if(res.data.code && 200 == res.data.code){
    //     wx.showToast({
    //       title: "读卡格式修改成功",
    //       icon: 'none',
    //       duration: 2000
    //     })
    //     wx.navigateBack({
    //       delta: 1
    //     })
    //   }else{
    //     wx.showToast({
    //       title: res.data.msg,
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.deviceId && '' != options.deviceId){
      that.setData({
        deviceId:options.deviceId
      })
     }
     that.cardFormat();
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