// pages/myInfo/myInfo.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const requestId = util.requestId
const version = util.version
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    isChange:false,
    dataUrl:dataUrl,
    isFacePic:true,
    faceContent:false,
    namesContent:false,
    pathUrl:'person/face/picture?path=',
    faceUrl:'',
    name:''
  },

  trimName(e){
     const that =this;
     if('' != e.detail.value){
      e.detail.value = e.detail.value.replace(/%/g, '');
      that.setData({
        name:e.detail.value.replace(/\s+/g, ''),
        namesContent:true,
      })
    }else{
      that.setData({
        name:'',
        namesContent:false
      })
    }
  },


  camera(){
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        var photoType = res.tempFilePaths[0].substring(res.tempFilePaths[0].length - 3);
        if ("jpg" == photoType){
          that.setData({
            faceUrl: res.tempFilePaths[0],
            faceContent:true,
          })
        }else{
          that.setData({
            faceContent:false,
          })
          wx.showToast({
            title: "图片格式只支持JPG格式的图片,请重新上传头像!",
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //是否展示人脸图片
  isShowFace(){
    const that = this;
    req.request("post","privacy?version="+version,{}).then(res=>{
      if(res.data.code && 200 == res.data.code){
        if('true' == res.data.data){
          that.setData({
            isFacePic:true
          })
        }else{
          that.setData({
            isFacePic:false
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

  getPersonInfo(){
    const that = this;
    req.request("post","user/info/get",{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(res.data.data != null){
          if('' != res.data.data.nickName){
            that.setData({
              namesContent:true,
              name:res.data.data.nickName,
            })
          }else{
            that.setData({
              namesContent:false,
              name:''
            })
          }
          if(('' != res.data.data.avatarUrl) && (-1 == res.data.data.avatarUrl.indexOf('https'))){
            that.setData({
              faceUrl:that.data.dataUrl + that.data.pathUrl + res.data.data.avatarUrl,
              faceContent:true,
              isChange:true
            })
          }else if(('' != res.data.data.avatarUrl) && (-1 != res.data.data.avatarUrl.indexOf('https'))){
            that.setData({
              faceUrl:res.data.data.avatarUrl,
              faceContent:true,
              isChange:true
            })
          }else{
            that.setData({
              faceUrl:'../../image/default_face.png',
              faceContent:false,
              isChange:false
            })
          }
        }else{
          that.setData({
            faceUrl:'../../image/default_face.png',
            faceContent:false,
            isChange:false
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

  submit(){
    const that = this;
    let token = wx.getStorageSync('token');
    let appId = wx.getStorageSync('currentAppId');
    let faceUrl = that.data.faceUrl;
    let name = that.data.name;
    console.log("faceUrl:",faceUrl);
    if(that.data.preventDuplication){
      if(-1 == faceUrl.indexOf('person/face/picture?path=')){
        wx.showLoading({
          title: '提交中',
        })
        if(-1 != faceUrl.indexOf("wxfile")){
          console.log(123)
          wx.uploadFile({
            url: dataUrl + "user/update/wx/user?name=" + name,
            filePath: faceUrl,
            name: 'files',
            header: {
              'Content-Type': 'application/json',
              'token': token,
              "requestId":requestId(),
              "timestamp":Date.parse(new Date())/1000
            },
            formData: {
              
            },
            success(respon) {
              wx.hideLoading();
              console.log(respon)
              that.setData({
                preventDuplication:true,
              })
              const data = JSON.parse(respon.data)
              if (200 == data.code && "SUCCESS" == data.msg) {
                let title = '';
                if(that.data.isChange){
                  title = '人员修改成功'
                }else{
                  title = '人员添加成功'
                }
               wx.showToast({
                 title: title,
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
                  title: data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
              //do something
      
            }
          })
        }else{
          req.request("post","user/update/wx/user?name=" + name,{
            "files":[],
          }).then(res=>{
            wx.hideLoading();
            that.setData({
              preventDuplication:true,
            })
            if(res.data.code && 200 == res.data.code){
              let title = ''
              if(that.data.isShowDelete){
                 title = '人员修改成功'
              }else{
                title = '人员添加成功'
              }
              wx.showToast({
                title: title,
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
        
      }else{
        wx.showLoading({
          title: '提交中',
        })
        req.request("post","user/update/wx/user?name=" + name,{
          "files":[],
        }).then(res=>{
          wx.hideLoading();
          that.setData({
            preventDuplication:true,
          })
          if(res.data.code && 200 == res.data.code){
            let title = ''
            if(that.data.isShowDelete){
               title = '人员修改成功'
            }else{
              title = '人员添加成功'
            }
            wx.showToast({
              title: title,
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
    }
    that.setData({
      preventDuplication:false,
    })
  },

  send(data){
    const that = this;
    req.request("post","user/update/wx/user?name=" + data.name,{
      "files":[data.files],
    }).then(res=>{
      wx.hideLoading();
      that.setData({
        preventDuplication:true,
      })
      if(res.data.code && 200 == res.data.code){
        let title = ''
        if(that.data.isChange){
           title = '人员修改成功'
        }else{
          title = '人员添加成功'
        }
        wx.showToast({
          title: title,
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getPersonInfo();
    that.isShowFace();
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