// pages/addPerson/addPerson.js
import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const version = util.version
const requestId = util.requestId
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    isShowDelete:false,
    isIdcard: false,
     namesContent:false,
     codeContent:false,
     isFacePic:true,
     index:0,
     array:[],
     isGetBtn:true,
     id:'',//人员id
     grantDeviceaNum:0,
     grantSuccessNum:0,
     form:{
       grantUpdateFlag:false,
       faceId:null,
       name:'',
       code:'',
       groupId:'',
       groupName:'',
       phone:'',
       idCard:'',
       picTempUrl:'../../image/default_face.png',
       icCard:'',
       password:'',
       grantDeviceIdList:[],
       personId:''
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

  trimCode(e){
    const that = this;
    if('' != e.detail.value){
      that.setData({
        ['form.code']:e.detail.value.replace(/\s+/g, ''),
        codeContent:true
      })
    }else{
      that.setData({
        ['form.code']:'',
        codeContent:false
      })
    }
  },

  trimPhone:function(e){
    let that = this;
    let value = that.validateNumber(e.detail.value)
    that.setData({
      ["form.phone"]: value
    })
  },

  trimIdCard: function (e) {
    let that = this;
     let value = e.detail.value;
     that.setData({
       ["form.idCard"]: value
     })
   },

    /*身份证验证输入是否正确
  
    *身份证号合法性验证
  
    *支持15位和18位身份证号
  
    *支持地址编码、出生日期、校验位验证*/

  getBirthAndSex: function (e) {

    let ts = this;

    let code = e //identity 为你输入的身份证


    let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };

    let tip = "";

    let pass = true;

    let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
    console.log("身份证id");
    if (!code || !code.match(reg)) {

      tip = "身份证号格式错误";
      if ("" == e) {
        tip = "身份证号码不能为空";
      }
      ts.showModal(tip);

      pass = false;

    } else if (!city[code.substr(0, 2)]) {

      tip = "身份证地址编码错误";
      ts.showModal(tip);

      pass = false;

    } else {

      //18位身份证需要验证最后一位校验位

      if (code.length == 18) {

        code = code.split('');

        //∑(ai×Wi)(mod 11)

        //加权因子

        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

        //校验位

        let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];

        let sum = 0;

        let ai = 0;

        let wi = 0;

        for (let i = 0; i < 17; i++) {

          ai = code[i];

          wi = factor[i];

          sum += ai * wi;

        }

        let last = parity[sum % 11];

        if (parity[sum % 11] != code[17]) {

          tip = "身份证校验位错误";
          ts.showModal(tip);

          pass = false;

        }

      }

    }
    if (!pass) {
      ts.setData({
        isIdcard: false
      })
    } else {
      ts.setData({
        isIdcard: true
      })
    }

  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  bindPickerChange(){

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

  //获取手机号
  getPhoneNumber (e) {
    const that = this;
    wx.login({
      success: res => {
        wx.showLoading({
          title: '请等待',
        })
        req.request("post","user/search/phone",{
          "encryptedData": e.detail.encryptedData,
          "iv": e.detail.iv,
          "appletCode": res.code
        }).then(res=>{
          wx.hideLoading();
          if(res.data.code && 200 == res.data.code){
            let data = JSON.parse(res.data.data)
            if(data.phoneNumber && '' != data.phoneNumber){
              wx.setStorageSync('phone',data.phoneNumber);
            }
            that.setData({
              isGetBtn:false,
              ["form.phone"]:data.phoneNumber,
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
    })
    
  },

  camera(){
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        that.setData({
          ['form.picTempUrl']: res.tempFilePaths[0],
        })
        // var photoType = res.tempFilePaths[0].substring(res.tempFilePaths[0].length - 3);
        // if ("jpg" == photoType){
        //   that.setData({
        //     ['form.picTempUrl']: res.tempFilePaths[0],
        //   })
        // }else{
        //   wx.showToast({
        //     title: "图片格式只支持JPG格式的图片,请重新上传头像!",
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      }
    })
  },

  selectAuthorized(){
    const that = this;
    let personId = that.data.form.personId;
    wx.navigateTo({
      url: '../selectAuthorized/selectAuthorized?personId='+personId,
    })
  },

  addCard(){
    const that = this;
    let icCard = that.data.form.icCard;
    wx.navigateTo({
      url: '../addCard/addCard?icCard='+icCard,
    })
  },

  selectDepartment(){
    wx.navigateTo({
      url: '../selectDepartment/selectDepartment'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log("options:",options)
    if(options.id && "" != options.id){
      wx.setNavigationBarTitle({
        title:"修改人员"
      })
      that.setData({
        isShowDelete:true,
        id:options.id,
        ['form.groupName']:options.groupName
      })
      that.getPersonDetails();
    }else{
      that.setData({
        isShowDelete:false,
      })
      wx.setNavigationBarTitle({
        title:"手动添加"
      })
    }
    that.initValidate() //验证规则函数
    that.isShowFace();
  },

  //获取用户详情
  getPersonDetails(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    req.request("post","person/details",{
      "appId": appId,
      "id":that.data.id
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(res.data.data){
          if("" != res.data.data.faceId){
            that.setData({
              ['form.picTempUrl']:dataUrl + "person/face/picture?faceId=" + res.data.data.faceId
            })
          }else{
            that.setData({
              ['form.picTempUrl']:"../../image/default_face.png"
            })
          }
          if("" != res.data.data.phone){
            that.setData({
              isGetBtn:false,
              ["form.phone"]:res.data.data.phone,
            })
          }else{
            that.setData({
              isGetBtn:true,
              ["form.phone"]:'',
            })
          }
          that.setData({
            ['form.name']:res.data.data.name,
            ['form.code']:res.data.data.code,
            ['form.idCard']:res.data.data.idCard,
            ['form.password']:res.data.data.password,
            ['form.icCard']:res.data.data.icCard,
            ['form.personId']:res.data.data.personId,
            ['form.faceId']:res.data.data.faceId,
            ['form.groupId']:res.data.data.faceId,
            grantDeviceaNum:res.data.data.grantTotalNum,
            grantSuccessNum:res.data.data.grantSuccessNum,
            namesContent:true,
            codeContent:true,
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
      name: {
        required: true,
        maxlength: 12
      },
      code:{
        required: true,
      }
    }
    messages = {
      name: {
        required: '请填写姓名',
        maxlength: "姓名不能超过12个字"
      },
      code:{
        required: '请填写工号',
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  //提交表单
  formSubmit(e){
    console.log(e);
    console.log('idcard',e.detail.value.idCard);
    const that = this;
    if(e.detail.value.idCard){
      if ("" != e.detail.value.idCard){
        that.getBirthAndSex(e.detail.value.idCard);
        if (!that.data.isIdcard) {
          return false;
        }
      }
    }
    
    let params = e.detail.value;
    if('../../image/default_face.png' == params.picTempUrl){
       e.detail.value.picTempUrl = ''
    }
    if (!that.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error.msg)
      return false
    }else{
      //发送请求
      console.log("params.picTempUrl",params.picTempUrl)
      if(that.data.preventDuplication){
        if('' == params.picTempUrl || undefined == params.picTempUrl){
          that.send(params);
        }else{
          let token = wx.getStorageSync('token');
          let appId = wx.getStorageSync('currentAppId');
          if(-1 == params.picTempUrl.indexOf('faceId')){
            wx.showLoading({
              title: '提交中',
            })
            wx.uploadFile({
              url: dataUrl + "person/face/upload?appId=" + appId,
              filePath: params.picTempUrl,
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
                that.setData({
                  preventDuplication:true,
                })
                console.log(respon)
                const data = JSON.parse(respon.data)
                if (200 == data.code && "SUCCESS" == data.msg) {
                  params.picTempUrl = data.data.tempFaceUrl;
                  that.send(params);
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
            // let oneFaceImg = params.picTempUrl.indexOf("=") + 1;
            // params.picTempUrl = params.picTempUrl.slice(oneFaceImg)
            params.picTempUrl = '';
            wx.showLoading({
              title: '提交中',
            })
            that.send(params);
          }
        }
      }
      that.setData({
        preventDuplication:false
      })
      
    } 
  },

  send(data){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    let grantDeviceIdList = [];
    if('' != data.grantDeviceIdList){
      grantDeviceIdList = data.grantDeviceIdList.split(',');
    }else{
      grantDeviceIdList = [];
    }
    req.request("post","person/update",{
      "appId": appId,
      "grantDeviceIdList":grantDeviceIdList,
      "groupId": data.groupId,
      "icCard": data.icCard,
      "idCard": data.idCard,
      "code": data.code,
      "name": data.name,
      "password": data.password,
      "personId": data.personId,
      "phone": data.phone,
      "picTempUrl": data.picTempUrl,
      "faceId":data.faceId,
      "grantUpdateFlag":data.grantUpdateFlag
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
  },

  deletePerson(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    req.request("post","person/delete",{
      "appId": appId,
      "personIdList": [that.data.id],
    }).then(res=>{
      wx.hideLoading();
      that.setData({
        preventDuplication:true
      })
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '人员删除成功',
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