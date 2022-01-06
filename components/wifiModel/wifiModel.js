var app = getApp();
 Component({
   properties: {
    certification:{
      type:Object
    },
    wifiList:{
      type:Array
    }
   },
   data: {
    showBox:false,
   },
   methods: {
    //关闭弹层 
    closeModel(){
      this.setData({
        showBox:false
      })
    },
    //显示弹层
    showModel(){
      this.setData({
        showBox:true
      })
    },
    selecttWifiBtn(e){
      this.closeModel()
      this.triggerEvent('selectWifi', e)
    },
    flushModel(e){
      this.triggerEvent('flushWifi', e)
    }
   },
   created: function(){
   },
   attached: function(){
   },
   ready: function(){
   },
   moved: function(){
   },
   detached: function(){
   }
 });
