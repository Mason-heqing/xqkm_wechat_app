// pages/myProject/myProject.js
var req = require('../../request/request.js');
let currentPage = 1
const pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:0,
    inputValue:"",
    projectList:[
      // {
      //   name:'深圳市芊熠智能硬件有限公司',
      //   id:1234567
      // },
      // {
      //   name:'深圳市芊熠智能软件有限公司',
      //   id:4567891
      // },
    ]
  },

  //添加项目
  addProject(){
    wx.navigateTo({
      url: '../addProject/addProject?ble=0',
    })
  },

  projectSet(e){
    let id = e.currentTarget.dataset.id;
    let appEditStatus = e.currentTarget.dataset.appeditstatus;
    if(appEditStatus){
        wx.navigateTo({
          url: '../projectSet/projectSet?id=' + id,
        })
    }else{
      wx.showToast({
        title: '没有权限',
        icon: 'none',
        duration: 2000
      })
    }
  },

  inputBind(e){
     const that = this;
     if('' != e.detail.value){
      that.setData({
        inputValue:e.detail.value.replace(/\s+/g, ''),
      })
    }else{
      that.setData({
        inputValue:'',
      })
    }
  },

  query(){
    const that = this;
    let value = that.data.inputValue;
    currentPage = 1;
    that.setData({
      projectList:[]
    })
    that.getRoomList(value)
  },

   //获取项目列表
   getRoomList(){
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","app/search",{
      "currentPage": currentPage,
      "pageSize": pageSize,
      searchStr:that.data.inputValue,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        currentPage++
        if (currentPage >= res.data.data.pages+1) {
          currentPage = res.data.data.pages+1
        } 
        let data = res.data.data.records;
        let oldData = that.data.projectList;
        if(res.data.data.records && 0 < res.data.data.records.length){
          that.setData({
            projectList:oldData.concat(data),
          })
        }else{
          if(0 === that.data.projectList.length){
            that.setData({
              projectList:[],
            })
          }
          wx.showToast({
            title:'没有数据了',
            icon: 'none',
            duration: 2000
          })
        }
      }else{
        // that.setData({
        //   showMessage:true,
        //   noMessage:false,
        // })
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
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 280
        })
      }
    });
  },

  upper(){
    const that = this;
    that.getRoomList();
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
    currentPage = 1;
    that.setData({
      inputValue:'',
      projectList:[]
    })
    that.getRoomList();
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
      console.log("下拉刷新")
      const that = this;
      currentPage = 1;
      that.setData({
        projectList:[]
      });
      that.getRoomList();
      wx.stopPullDownRefresh();
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