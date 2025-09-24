var zizhixing=(function () {
    var main=document.getElementsByClassName("main")[0],
        header=document.getElementsByClassName("header")[0],
        footer=document.getElementsByClassName("footer")[0];
        var musicAudio=document.getElementById("musicAudio"),
            musicBtn=document.getElementsByClassName("musicBtn")[0],
            current=document.getElementsByClassName("current")[0],
            duration=document.getElementsByClassName("duration")[0],
            already=document.getElementsByClassName("already")[0],
            www=document.getElementsByClassName("wrapper")[0],
            uio=document.getElementById("uio");



        let $Fn=$.Callbacks(),
            step=0,
            curTop=0;

        $Fn.add(function (ly) {
            ly=ly.replace(/&#(\d+);/g,function (q,w) {
                switch (parseFloat(w)){
                    case 32:
                        q="";
                        break;
                    case 40:
                        q="(";
                        break;
                    case 41:
                        q=")";
                        break;
                    case 45:
                        q="-";
                        break
                }
                return q
            })

            var ary=[];
            var reg = /\[(\d+)&#58;(\d+)&#46;(?:\d+)\]([^&#]+)(?:&#10;)?/g;
            var ly=ly.replace(reg,function (res,minute,second,value) {


                ary.push({
                    minute:minute,
                    second:second,
                    value:value
                })
                return res;
            });
            var str=``;
            for(var i=0;i<ary.length;i++){
                str+=`<p class="kk" data-minute="${ary[i].minute}" data-second="${ary[i].second}">${ary[i].value}</p>`
            }
            www.innerHTML=str;

        });

        // 开始播放，仅此而已
        $Fn.add(function () {
            //musicAudio.play();
            musicAudio.addEventListener("canplay",function () {  //指定播放，准备好了马上播放前
                uio.style.display="none";
                musicBtn.style.display="block";
                musicBtn.classList.add("move");
                Ad=window.setInterval(jisuanbofangliang,1000)

            })


        });

        $Fn.add(function () {      // 停止播放的功能
            musicBtn.addEventListener('touchstart', function (e) {
                if(musicAudio.paused){
                    musicAudio.play();
                    musicBtn.classList.add("move");
                    Ad=window.setInterval(jisuanbofangliang,1000);
                    return;
                }
                musicAudio.pause();
                musicBtn.classList.remove("move");
                clearInterval(Ad);

            })
        });





        function jisuanbofangliang() {
            var curTime=musicAudio.currentTime,
                durTime=musicAudio.duration;
            if(curTime>=durTime){
                clearInterval(Ad);
                current.innerText=geshi(durTime);
                duration.innerText=geshi(durTime);
                already.style.width=100+"%";
                musicBtn.classList.remove("move")
                return
            }
            current.innerText=geshi(curTime);
            duration.innerText=geshi(durTime);
            already.style.width=curTime/durTime*100+"%";
            //-------------------------
            var ary=geshi(curTime).split(":"),
                minute=ary[0],
                second=ary[1];
            var $ps = $(".kk");
            var $pps = $ps.filter('[data-minute="' + minute + '"]').filter('[data-second="' + second + '"]');
            console.log($pps);
            if($pps.length>0){
                if (!$pps.hasClass('select')) {
                    $pps.addClass('select')
                        .siblings().removeClass('select');
                    step++;
                    if (step >= 4) {
                        console.log(1);
                        curTop -= .84;
                        www.style.top=curTop+"rem";
                    }
                }

            }


        }

        function geshi(time) {
            var minute = Math.floor(time / 60),
                second = Math.ceil(time - minute * 60);
            minute<10?minute="0"+minute:null;
            second<10?second="0"+second:null;
            return minute+":"+second;
        }


        function height() {
            var W=document.documentElement.clientHeight,
                font=parseFloat(document.documentElement.style.fontSize);
              var H=W-header.clientHeight-footer.clientHeight-font*0.8;
              main.style.height=H+"px";
        }
        return {
            init:function () {
                height();
                window.onresize=function () {
                    height();
                };
                $.ajax({
                    url:"json/lyric.json",
                    method:"get",
                    dataType:"json",
                    success:function (data) {
                        var data=data.lyric;
                        console.log(data);
                        $Fn.fire(data)
                    }
                })


            }
        }
    }
)();
zizhixing.init();
