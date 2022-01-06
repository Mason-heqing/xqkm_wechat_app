export const  request=(met,url,params)=>{
  // const baseUrl="http://192.168.1.35:9019/";
  // const baseUrl = "https://pre.qy-rgs.com:9019/"
  const baseUrl = "https://guard.qy-rgs.com:9019/"
  //随机值
  const requestId = function requestId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  var token = wx.getStorageSync('token') ? wx.getStorageSync('token') :'';
  return new Promise((resolve,reject)=>{
      wx.request({
        url: baseUrl+url,
        method:met,
        data:{
          ...params
        },
        header: {
          'Content-Type': 'application/json',
          'token': token,
          "requestId":requestId(),
          "timestamp":Date.parse(new Date())/1000
        },
        success:(res)=>{
          if((res.data.code && 304 == res.data.code)||(res.data.code && 303 == res.data.code)){
            wx.removeStorageSync('token')
            wx.reLaunch({
              url: '../userLogin/userLogin'
            })
          }
          resolve(res);
        },
        fail:(err)=>{
          reject(err);
        }
      });
  })
}

