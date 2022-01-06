// pages/connectSuccess/connectSuccess.js
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    needBind : true
  },
  bingwx : function(){
    wx.scanCode({
      onlyFromCamera: true,
      success:function(res){
        var qrcode_url = res.result;
        wx.qy.discoverDevice({
          "type": "qrcode",        // 设备发现方式，支持 qrcode/bluetooth/input
          "qrcode_url": qrcode_url,
          success: function(res){
              // 设备绑定成功 
              that.setData({
                needBind : false
              });
          },
          fail: function(res){
              console.log(JSON.stringify(res))
          }
        })
      }
    })
  },
  configJmp : function(){
  /*
      wx.scanCode({
        onlyFromCamera: true,
        success:function(res){
          var qrcode_url = res.result;
          wx.qy.discoverDevice({
            "type": "qrcode",        // 设备发现方式，支持 qrcode/bluetooth/input
            "qrcode_url": qrcode_url,
            success: function(res){
                // 设备绑定成功 
            },
            fail: function(res){
                console.log(JSON.stringify(res))
            }
          })
        }
      })
*/

    /*
    wx.qy.discoverDevice({
        "type": "qrcode",        // 设备发现方式，支持 qrcode/bluetooth/input
        "qrcode_url": "https://open.work.weixin.qq.com/connect?xxx"
    },
    success: (res) => {
        // 设备绑定成功 
    },
    fail: (res) => {
        console.log(JSON.stringify(res))
    }
  );
  */  
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    wx.setNavigationBarTitle({
      title:'配置成功'
    })

    if((wx.qy == undefined) || (wx.qy.discoverDevice == undefined)){
      that.setData({
        needBind : false
      });
    }

  },
 
})