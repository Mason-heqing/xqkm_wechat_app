// pages/upDepartment/upDepartment.js
import WxValidate from '../../utils/WxValidate.js'
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    namesContent:false,
    isParent:true,
    index:0,
    array:[],
    form:{
      title:'',
      appId:'',
      id:'',
      parentId:'',
      parentName:'',
    }
  },

  trimName(e){
    const that = this;
    if('' != e.detail.value){
      that.setData({
        ['form.title']:e.detail.value.replace(/\s+/g, ''),
        namesContent:true
      })
    }else{
      that.setData({
        ['form.title']:'',
        namesContent:false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log(options)
    if(options.currentParentDepartmentId){
      console.log("进入部门编辑：")
       that.setData({
         ['form.parentId']:options.currentParentDepartmentId,
         ['form.title']:options.name,
         ['form.id']:options.id
       })
       that.getparentDepartment();
    }
    that.initValidate() //验证规则函数
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
      title: {
        required: true,
        maxlength: 12
      },
    }
    messages = {
      title: {
        required: '请输入部门名称',
        maxlength: "部门名称不能超过12个字"
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  //获取上级部门信息
  getparentDepartment(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    let appName = wx.getStorageSync('currentAppName');
    req.request("post","person/group/search/parent",{
      "appId": appId,
      "id": that.data.form.id,
      "parentId": that.data.form.parentId,
      "title": that.data.form.title,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(0 < res.data.data.length){
          // let dataArray = [];
          res.data.data.forEach((item,index)=>{
             if(item.selectFlag){
                 that.setData({
                   index:index
                 })
             }
          })
          // that.setData({
          //   ['form.parentId']:res.data.data.parentId,
          //   ['form.parentName']:res.data.data.parentTitle
          // })
          that.setData({
            array:res.data.data,
          })
        }else{
          let arr = [{groupTitle:appName,groupId:'0'}];
          console.log("根级：",arr);
          that.setData({
            array:arr
          })
        }
        // wx.showToast({
        //   title: '新增部门成功',
        //   icon: 'none',
        //   duration: 2000
        // })
        // setTimeout(()=>{
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //提交表单
  formSubmit(e){
    const that = this;
    let params = e.detail.value;
    if (!that.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error.msg)
      return false
    }else{
      //发送请求
      console.log("params:",params)
      if(that.data.preventDuplication){
        this.send(params)
      }
      that.setData({
        preventDuplication:false,
      })
    } 
  },

  send(data){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    req.request("post","person/group/update",{
      "appId": appId,
      "id": data.id,
      "parentId": data.parentId,
      "title": data.title,
    }).then(res=>{
      wx.hideLoading();
      that.setData({
        preventDuplication:true,
      })
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '新增部门成功',
          icon: 'none',
          duration: 2000
        })
        let pages = getCurrentPages();   //当前页面
        let prevPage = pages[pages.length - 2];   //上一页面
        prevPage.setData({
          currentParentDepartmentId:data.parentId
        })
        prevPage.getDepartment();
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
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