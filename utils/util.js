const gbk = require('./gbk.js');

const hexStringToBuff = str => { //str='中国：WXHSH'
  const buffer = new ArrayBuffer((sumStrLength(str)) * 4)
  const dataView = new DataView(buffer)
  var data = str.toString();
  var p = 0; //ArrayBuffer 偏移量
  for (var i = 0; i < data.length; i++) {
    if (isCN(data[i])) { //是中文
      //调用GBK 转码
      var t = gbk.encode(data[i]);
      for (var j = 0; j < 2; j++) {
        //var code = t[j * 2] + t[j * 2 + 1];
        var code = t[j * 3 + 1] + t[j * 3 + 2];
         var temp = parseInt(code, 16)
        //var temp = strToHexCharCode(code);
        dataView.setUint8(p++, temp)
      }
    } else {
      var temp = data.charCodeAt(i);
      dataView.setUint8(p++, temp)
    }
  }
  return buffer;
}

function sumStrLength(str) {
  var length = 0;
  var data = str.toString();
  for (var i = 0; i < data.length; i++) {
    if (isCN(data[i])) { //是中文
      length += 2;
    } else {
      length += 1;
    }
  }
  return length;
}

function isCN(str) {
  if (/^[\u3220-\uFA29]+$/.test(str)) {
    return true;
  } else {
    return false;
  }
}

const formatTime = date => {
  var date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//时间转化器
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//随机值
const requestId =  function requestId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);

  });
}

const random6 = function random6(){
  let chars = '0123456789';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = chars.length;
  var code = '';
  for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return code;
}

//token失效后重新登录
const invalidToken = () =>{
  wx.reLaunch({
    url: '../index/index'
  })
}
//获取当前时间
const data = Date.parse(new Date());

function Base64() {
  // private property
  let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // public method for encoding

  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      if(isNaN(chr2) && isNaN(chr3)){
        chr2 = 0;
      }else if(isNaN(chr3)){
        chr3 = 0;
      }

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
          _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
          _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    if(!isNaN(chr3) && (chr3 > 0)){
      output += "AA==";
    }
    return output;
  }

  // public method for decoding
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding
  var _utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  // private method for UTF-8 decoding
  var _utf8_decode = function (utftext) {
    var string = "";
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

const base64Encode = n => {
  var base64 = new Base64();
  return base64.encode(n);
}

const base64Decode = n => {
  var base64 = new Base64();
  return base64.decode(n);
}

//版本号
const version = '4';


//本地环境测试
// const dataUrl = "http://192.168.1.35:9019/"
// const updataUrl = "http://192.168.1.35:9019/wx/picture/upload/user/face"
// const adminUpdataUrl = "http://192.168.1.35:9019/wx/picture/upload/user/phoneFace"
// const qrcodeUrl = "http://192.168.1.35:9019/wx/building/qrcode/generate"

//预发布环境
// const dataUrl = "https://pre.qy-rgs.com:9019/"
// const updataUrl = "https://pre.qy-rgs.com:9019/wx/picture/upload/user/face"
// const adminUpdataUrl = "https://pre.qy-rgs.com:9019/wx/picture/upload/user/phoneFace"
// const qrcodeUrl = "https://pre.qy-rgs.com:9019/wx/building/qrcode/generate"

//生产环境
const dataUrl = "https://guard.qy-rgs.com:9019/"
const updataUrl = "https://guard.qy-rgs.com:9019/wx/picture/upload/user/face"
const adminUpdataUrl = "https://guard.qy-rgs.com:9019/wx/picture/upload/user/phoneFace"
const qrcodeUrl = "https://guard.qy-rgs.com:9019/wx/building/qrcode/generate"

module.exports = {
  hexStringToBuff: hexStringToBuff,
  formatTime: formatTime,
  requestId: requestId,
  data:data,
  dataUrl: dataUrl,
  // appId:appId,
  updataUrl: updataUrl,
  adminUpdataUrl: adminUpdataUrl,
  invalidToken: invalidToken,
  qrcodeUrl: qrcodeUrl,
  base64Encode : base64Encode,
  base64Decode : base64Decode,
  version:version,
  random6:random6
}
