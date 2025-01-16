var vueApp = new Vue({

    el: "#game",
    data : {
      
       startTime : 0, 
       startTimeDuba : 0, 
       carTop : 55,
       carLeft : 40,
       dubaTop : [50,0,30,40,100,140,110,5,9,70,69,31,250,248],
       dubaOto : null,
       yukariAsagiKaymaHizi : 500,
       yukariAsagiKaymaDerecesi : 50,
       yolHizi : 3,
       dubaHizi : 3,
       oyunBittimi : true,
       dubaRight : null
   
    },
    methods : {
   
       yolKaydir() {     
   
   
           let vw = $(window).width(), car = $("#car"),  carw = car.width(),dubaw = $(".duba").width(), ths = this;  
           
            kaydir = setInterval(() =>  {           
               ths.startTime = ths.startTime - ths.yolHizi;
               $(".c3-stripe").css("background-position", ths.startTime + "px");
               this.dubaRight = parseInt($(".duba").css("right"));
   
               if(this.dubaRight> vw - carw) {
   
                   this.carpismaControl();
               }
   
           })
       },
   
       carpismaControl() {
           
           let dubaTopOffset = $(".duba").position().top, carTopOffset = $("#car").position().top;
   
          if(carTopOffset>dubaTopOffset) {
           console.log(carTopOffset - dubaTopOffset);
               if((carTopOffset - dubaTopOffset) > 35) {
   
                   this.dubaOtoKonum();
               }
               else {
                   this.oyunDurdur();
                  
               }
   
          } else if(dubaTopOffset>carTopOffset) {
   
               if((dubaTopOffset - carTopOffset) > 50) {
                   this.dubaOtoKonum();
               } else {
                   this.oyunDurdur();
                
                 
               }
   
           }
          
   
       },
   
       oyunDurdur() {
           clearInterval(kaydir);
           clearInterval(dubaKaydir);
           $("#car").addClass("kaza");
             this.oyunBittimi = true
           
           
   
       },
   
       dubaOtoKonum() {     
   
                this.dubaOto =  Math.floor(Math.random() * this.dubaTop.length);
   
                let ths = this;  
   
                this.startTimeDuba = 0;
   
                ths.dubaHizi = ths.dubaHizi + 0.2;
                ths.yolHizi = ths.yolHizi + 0.2;
                 
               ths.dubaHizi>20 ? ths.dubaHizi = 20 : "";
               ths.yolHizi>20 ? ths.yolHizi = 20 : "";
             
               ths.startTimeDuba = ths.startTimeDuba + ths.dubaHizi;
               $(".duba").css({
               "right": ths.startTimeDuba + "px",
               "top": ths.dubaTop[this.dubaOto] + "px"
               });
   
      
       },
   
       dubalar() {     
   
           this.dubaOto =  Math.floor(Math.random() * this.dubaTop.length);
   
           let ths = this;  
   
           dubaKaydir = setInterval(() =>  {           
               ths.startTimeDuba = ths.startTimeDuba + ths.dubaHizi;
               $(".duba").css({
               "right": ths.startTimeDuba + "px",
               "top": ths.dubaTop[this.dubaOto] + "px"
               });
           })
       },
   
       arabaPosition() {
   
           if(this.carTop<0) {
               this.carTop = -20
           } 
   
           if(this.carTop>250) {
               this.carTop = 250
           } 
   
           $("#car").stop().animate({ 
               "left": this.carLeft + "px", 
               "top": this.carTop + "px"
           },this.yukariAsagiKaymaHizi);
       },
   
   
       yukariKayma() {
         
           this.carTop = this.carTop - this.yukariAsagiKaymaDerecesi;
           this.arabaPosition(this.carLeft, this.carTop);
           $("#car").addClass("yukari");
           setTimeout(function() {
               $("#car").removeClass("yukari");
           },300)
   
       },
       asagiKayma() {
         
           this.carTop = this.carTop + this.yukariAsagiKaymaDerecesi;
           this.arabaPosition(this.carLeft, this.carTop);
           $("#car").addClass("asagi");
           setTimeout(function() {
               $("#car").removeClass("asagi");
           },300)
   
       },
       elfren() {
         
           this.carTop = this.carTop - this.yukariAsagiKaymaDerecesi - this.yukariAsagiKaymaDerecesi;
           this.arabaPosition(this.carLeft, this.carTop);
           $("#car").addClass("elfreni");
           setTimeout(function() {
               $("#car").removeClass("elfreni");
           },300)
   
       },
   
       tekrar() {
   
           this.yolKaydir();
           this.dubalar();
           this.arabaPosition();
           this.startTime = 0;
           this.startTimeDuba = 0;
           this.dubaHizi = 3;
           this.yolHizi = 3;
           this.oyunBittimi = false;
           $("#car").removeClass("kaza");
           $(".duba").css("right",0);
       }
   
    },
   
    mounted() {
      
        let ths = this;
        document.onkeydown = function(e) {
       switch (e.keyCode) {
           case 38:
           ths.yukariKayma("yukari");
               break;
           case 40:
           ths.asagiKayma("asagi");
               break;
           case 32:
           ths.elfren("elfren");
           break;
       }
   }
   
       //this.yolKaydir();
       //this.dubalar();
       this.arabaPosition();
   
    }
   
   })