// pages/hardwareInterface/hardwareInterface.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    deviceId:'',
    typeName:[],//韦根输出格式
    typeValue:[],//韦根输出格式下标
    typeIndex:[],
    putOutTypeName:[],//韦根输出内容
    putOutTypeValue:[],//韦根输出内容下标
    putOutTypeIndex:0,
    inputTypeName:[],//韦根输入格式
    inputTypeValue:[],//韦根输入格式下标
    inputTypeIndex:0,
    baudratenName:[],//波特率
    baudratenValue:[],//波特率下标
    baudrateIndex:0,
    databitName:[],//数据位
    databitValue:[],//数据位下标
    databitIndex:0,
    stopbitName:[],//停止位
    stopbitValue:[],//停止位下标
    stopbitIndex:0,
    checktypeName:[],//校验
    checktypeValue:[],//校验下标
    checktypeIndex:0,
    putOutTypeName:[],//输出内容
    putOutTypeValue:[],//输出内容下标
    putOutTypeIndex:0,
    switchOutMode:[],//控制信号
    switchOutModeValue:[],//控制信号下标
    switchOutModeIndex:0,
    switchOutModeValue:[],
    switchCheckEdenableGAT:false,//防拆报警
    enableGATValue:0,//防拆报警当前值
    switchCheckedEntermode:false,//门磁输入
    entermode:0,//门磁输入当前值
  },

  bindPickerChangeWwitchOutMode(e){
     const that = this;
     that.setData({
      switchOutModeIndex:parseInt(e.detail.value)
     })
  },


  switchChangeEntermode(e){
    console.log("门磁输入：",e.detail.value);
    const that = this;
    let value = 2;
    if(e.detail.value){
      value = 1;
    }else{
      value = 2;
    }
    that.setData({
      switchCheckedEntermode:e.detail.value,
      entermode:value
    })
  },

  switchChangeEdenableGAT(e){
    const that = this;
    let value = 0;
    if(e.detail.value){
      value = 1;
    }else{
      value = 0;
    }
    that.setData({
      switchCheckEdenableGAT:e.detail.value,
      enableGATValue:value
    })
  },

  bindPickerTypeChange(e){
    const that = this;
    that.setData({
      typeIndex:parseInt(e.detail.value)
    })
  },

  bindPickerPutOutTypeChange(e){
    const that = this;
    that.setData({
      putOutTypeIndex:parseInt(e.detail.value)
    })
  },

  bindPickerInputTypeChange(e){
    const that = this;
    that.setData({
      inputTypeIndex:parseInt(e.detail.value)
    })
  },

  bindPickerBaudratenChange(e){
    console.log("波特率:",e.detail.value)
    const that = this;
    that.setData({
      baudrateIndex:parseInt(e.detail.value)
    })
  },

  bindPickerDatabitChange(e){
    const that = this;
    that.setData({
      databitIndex:parseInt(e.detail.value)
    })
  },

  bindPickerStopbitChange(e){
    const that = this;
    that.setData({
      stopbitIndex:parseInt(e.detail.value)
    })
  },

  bindPickerChecktypeChange(e){
    const that = this;
    that.setData({
      checktypeIndex:parseInt(e.detail.value)
    })
  },

  bindPickerPutOutTypeChange(e){
    const that = this;
    that.setData({
      putOutTypeIndex:parseInt(e.detail.value)
    })
  },

  geThardwareInterface(){
    const that = this;
    let dataSerial = app.globalData.dataSerial;
    let dataWeigand = app.globalData.dataWeigand;
    let dataSwitchCtrl = app.globalData.dataSwitchCtrl;
    dataWeigand.forEach((e)=>{
       if('type' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          typeName:e.optionName,
          typeValue:e.optionValue,
          typeIndex:index
        })
       }else if('putOutType' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          putOutTypeName:e.optionName,
          putOutTypeValue:e.optionValue,
          putOutTypeIndex:index
        })
      }else if('InputType' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          inputTypeName:e.optionName,
          inputTypeValue:e.optionValue,
          inputTypeIndex:index
        })
      }
    })
    dataSerial.forEach((e)=>{
      if('baudrate' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          baudratenName:e.optionName,
          baudratenValue:e.optionValue,
          baudrateIndex:index
        })
      }else if('databit' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          databitName:e.optionName,
          databitValue:e.optionValue,
          databitIndex:index
        })
      }else if('stopbit' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          stopbitName:e.optionName,
          stopbitValue:e.optionValue,
          stopbitIndex:index
        })
      }else if('checktype' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          checktypeName:e.optionName,
          checktypeValue:e.optionValue,
          checktypeIndex:index
        })
      }else if('putOutType' == e.key){
        let index = e.optionValue.indexOf(e.value);
        that.setData({
          putOutTypeName:e.optionName,
          putOutTypeValue:e.optionValue,
          putOutTypeIndex:index
        })
      }
    })
    dataSwitchCtrl.forEach((e)=>{
      if('switchOutMode' == e.key){
        let index = e.optionValue.indexOf(e.value);
        console.log("控制信号：",e.optionName[index]);
        that.setData({
          switchOutMode:e.optionName,
          switchOutModeValue:e.optionValue,
          switchOutModeIndex:index
        })
      }
      if('enableGAT' == e.key){
        let enableGATShitch = null;
        if(1 === e.value){
          enableGATShitch = true
        }else{
          enableGATShitch = false
        }
        that.setData({
          switchCheckEdenableGAT:enableGATShitch,
          enableGATValue:e.value
        })
      }
      if('entermode' == e.key){
         let entermodeShitch = null;
         if(1 === e.value){
          entermodeShitch = true;
         }else{
          entermodeShitch = false;
         }
         that.setData({
          switchCheckedEntermode:entermodeShitch,
          entermode:e.value
         })
      }
    })
    console.log("dataSwitchCtrl:",dataSwitchCtrl);
  },

  formSubmit(e){
     console.log(e.detail.value);
     const that = this;
     let formData = e.detail.value;
     let sendJson = {};
     let jsonSwitchCtrl = {};
     let jsonWeigand = {};
     let jsonSerial = {};
     jsonSwitchCtrl.switchOutMode = parseInt(formData.switchOutMode);
     jsonSwitchCtrl.entermode = parseInt(formData.entermode);
     jsonSwitchCtrl.enableGAT = parseInt(formData.enableGAT);
     jsonWeigand.type = parseInt(formData.typeValue);
     jsonWeigand.InputType = parseInt(formData.inputType);
     jsonWeigand.putOutType = parseInt(formData.putOutTypeW);
     jsonSerial.baudrate = parseInt(formData.baudrate);
     jsonSerial.databit = parseInt(formData.databit);
     jsonSerial.stopbit = parseInt(formData.stopbit);
     jsonSerial.checktype = parseInt(formData.checktype);
     jsonSerial.putOutType = parseInt(formData.putOutTypeS);
     sendJson.switchCtrl = jsonSwitchCtrl;
     sendJson.weigand = jsonWeigand;
     sendJson.serial = jsonSerial;
     if(that.data.preventDuplication){
      wx.showLoading({
        title: '提交中',
      })
      req.request("post","device/config/set",{
        dataConfigStr:sendJson,
        deviceId:that.data.deviceId,
      }).then(res=>{
        wx.hideLoading()
        that.setData({
          preventDuplication:true,
         })
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: "音量设置修改成功",
            icon: 'none',
            duration: 2000
          })
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
     }
     that.setData({
      preventDuplication:false
     })

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
     that.geThardwareInterface();
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