const req = require('../../request/request.js');
Page({
  data: {
    dataTree: [
      // {
      //   id: 1,
      //   name: '一级A',
      //   children: [
      //     {
      //       id: 23,
      //       name: '二级A-a',
      //       children: [
      //         {
      //           id: 98,
      //           name: '三级A-a-1'
      //         }
      //       ]
      //     },
      //     {
      //       id: 20,
      //       name: '二级A-b',
      //     }
      //   ]
      // },
      // {
      //   id: 2,
      //   name: '一级B',
      //   children: [
      //     {
      //       id: 21,
      //       name: '二级B-a',
      //     }
      //   ]
      // }
    ],
    selectKey: '', //选中的节点id
  },
  handleSelect(e) {
    if (e.detail.tips) {
      wx.showModal({
        content: e.detail.tips,
        showCancel: false,
      })
    } else {
      this.setData({
        selectKey: e.detail.item.id
      })
      let pages = getCurrentPages();   //当前页面
      let prevPage = pages[pages.length - 2];   //上一页面
      prevPage.setData({
        ['form.groupId']:e.detail.item.id,
        ['form.groupName']:e.detail.item.name,
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },

  //获取部门信息
  getDepartment(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","person/group/tree?appId=" + appId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let data = res.data.data;
        console.log(res)
        if(0 < data.length){
          that.setData({
            dataTree:data,
          })
        }else{
          that.setData({
            dataTree:[]
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

  onLoad: function () {
    const that = this;
    that.getDepartment();
  }
})
