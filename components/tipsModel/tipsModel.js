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
    flushModel(e){
      this.triggerEvent('close', e)
    }
   }
 });
