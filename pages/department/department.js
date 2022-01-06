// pages/department/department.js
const app = getApp()
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:0,
    scrollWidth:0,
    isShowCrumbs:true,
    parentId:'',
    currentParentDepartmentId:'0',
    departmentList:[],
    crumbsList:[]
  },

  //添加部门
  addDepartment(){
   const that = this;
   let currentParentDepartmentId = that.data.currentParentDepartmentId; 
   wx.navigateTo({
      url: '../upDepartment/upDepartment?currentParentDepartmentId=' + currentParentDepartmentId,
   })
  },

  //编辑部门
  details(e){
    const that = this;
    let currentParentDepartmentId = that.data.currentParentDepartmentId;
    console.log(e)
    console.log("currentParentDepartmentId:",currentParentDepartmentId)
    let id = e.currentTarget.dataset.item.id;
    let name = e.currentTarget.dataset.item.title;
    wx.navigateTo({
      url: '../upDepartment/upDepartment?currentParentDepartmentId=' + currentParentDepartmentId + '&id=' + id + '&name=' + name,
   })
  },

  //部门删除
  delete(e){
   const that = this;
   let id = e.currentTarget.dataset.item.id;
   wx.showLoading({
    title: '正在删除',
  })
   req.request("post","person/group/delete?id="+id,{}).then(res=>{
    wx.hideLoading();
    if(res.data.code && 200 == res.data.code){
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      })
      that.getDepartment();
    }else{
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
  });
  },

  //获取部门信息
  getDepartment(e){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","person/group/search",{
      "appId": appId,
      "parentId":that.data.currentParentDepartmentId,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(0 < res.data.data.length){
          that.setData({
            departmentList:res.data.data
          })
        }else{
          that.setData({
            departmentList:[]
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //查询下级部门
  searchSub(e){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    let id = e.currentTarget.dataset.item.id;
    let title = e.currentTarget.dataset.item.title;
    let json = {};
    json.name = title;
    json.id = id;
    that.data.crumbsList.push(json);
    that.setData({
      isShowCrumbs:false,
      crumbsList:that.data.crumbsList,
    })
    that.setData({
      currentParentDepartmentId:id
    })
    wx.setNavigationBarTitle({
      title: title
    })
    req.request("post","person/group/search",{
      "appId": appId,
      "parentId":id,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(0 < res.data.data.length){
          that.setData({
            departmentList:res.data.data
          })
        }else{
          that.setData({
            departmentList:[]
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //导航切换
  changeDepartment(e){
    console.log(e)
    const that = this;
    let id = e.currentTarget.dataset.item.id;
    let title = e.currentTarget.dataset.item.name;
    let index =  e.currentTarget.dataset.index;
    let newArr = [];
    if(that.data.crumbsList.length == index + 1){
      newArr = that.data.crumbsList
    }else{
      newArr = that.data.crumbsList.splice(index,that.data.crumbsList.length-1)
    }
    console.log(newArr)
    let appId = wx.getStorageSync('currentAppId');
    wx.setNavigationBarTitle({
      title: title,
    })
    that.setData({
      currentParentDepartmentId:id,
      crumbsList:newArr
    })
    req.request("post","person/group/search",{
      "appId": appId,
      "parentId":id,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(0 < res.data.data.length){
          that.setData({
            departmentList:res.data.data
          })
        }else{
          that.setData({
            departmentList:[]
          })
        }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          // scrollHeight: res.windowHeight - res.windowWidth / 750 * 120
          scrollHeight:res.windowHeight,
          scrollWidth:res.windowWidth
        })
      }
    });
    that.getDepartment();
    // that.setData({
    //   crumbsList:app.globalData.departmentNavigation
    // })
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
    const that = this;
    // that.getDepartment();
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