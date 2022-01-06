var app = getApp();
 Component({
   properties: {
   },
   data: {
   },
   methods: {
    //关闭弹层 
    closeModel(){
      this.setData({
        showBox:false
      })
      this.triggerEvent('bleStart')
    },
    //显示弹层
    showModel(){
      this.setData({
        showBox:true
      })
    },
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
